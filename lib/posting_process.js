const { data } = require("sdk/self");
var tabs = require('sdk/tabs');

var postingProcess = {

  menuItem: null,

  messageSecret: "",

  pendingPost: false,

  // Remembers where the PrivlyUrl will be placed based on the context menu
  postingResultTab: null,

  postingApplicationTab: null,

  postingApplicationStartingValue: "",

  targetNodeId: "",
    
  menuSetup: function(popupButton) {

    var cm = require("sdk/context-menu");
    this.menuItem = cm.Item({
      label: "New Message",
      context: cm.PredicateContext(function(context) { 
        return context.isEditable;
      }),
      contentScriptFile: [data.url("./content_scripts/posting_process/sendkeys.js"),
                          data.url("./content_scripts/posting_process/context_menu.js")],
      onMessage: function(message) {
        postingProcess.postingHandler(message, tabs.activeTab, "Message");
      },
    });
    
    require("sdk/page-mod").PageMod({
      include: "chrome://privly/content/privly-applications/Message/new.html",
      contentScriptFile: data.url("./content_scripts/posting_process/privly_app.js"),
      contentScriptWhen: "start",
      onAttach: function(worker) {
        worker.port.on("messageSecret", function(message) {
          postingProcess.messageSecret = message;
        });
        worker.port.on("askInitialContent", function(message) {
          worker.port.emit("initialContent", {
            secret: postingProcess.messageSecret,
            initialContent: postingProcess.postingApplicationStartingValue,
          });
        });
        worker.port.on("setPrivlyURL", function(message) {
          postingProcess.receivePrivlyURL(message);
        });
      },
    });

    var notifyScript = "window.addEventListener('click', function(event) { " +
                       "  self.port.emit('click', 'Panel clicked!');" +
                       "}, false);"

    postingProcess.pendingNotif = require("sdk/panel").Panel({
      contentURL: data.url("./pages/pending.html"),
      contentScript: notifyScript,
      position: popupButton,
      height: 100,
    });

    postingProcess.pendingNotif.port.on("click", function(message) {
      postingProcess.pendingNotif.hide();
    });

    postingProcess.errorNotif = require("sdk/panel").Panel({
      contentURL: data.url("./pages/posting_error.html"),
      contentScript: notifyScript,
      position: popupButton,
      height: 130,
    });

    postingProcess.errorNotif.port.on("click", function(message) {
      postingProcess.errorNotif.hide();
    });

  },

  receivePrivlyURL: function(url) {

    if (postingProcess.postingResultTab !== null) {

      var resultTab = postingProcess.postingResultTab;

      //Switches to the result tab
      resultTab.activate();

      // post URL in the resultTab page.
      var worker = resultTab.attach({
        contentScriptFile: [data.url("./content_scripts/posting_process/sendkeys.js"),
                            data.url("./content_scripts/posting_process/post_link.js")],
        contentScriptOptions: {
          privlyURL: url,
          nodeId: postingProcess.targetNodeId,
        },
      });
    
      worker.port.on("postStatus", function(message) {
        if (message === "complete") {
          postingProcess.postingApplicationTab.close();
        } else if (message === "error") {
          // Notify the user of the posting error
          postingProcess.errorNotif.show();
        }
        postingProcess.postingApplicationTab = null;
      });
    
      postingProcess.pendingPost = false;

      //remove the record of where we are posting to
      postingProcess.postingResultTab = null;
    }
  },

  postingHandler: function(info, sourceTab, postingApplicationName) {

    if (postingProcess.pendingPost === false) {

      postingProcess.targetNodeId = info.nodeId;

      // Local storage shim
      var { ls } = require("./local_storage.js");

      // Open a window
      var postingDomain = ls.getItem("posting_content_server_url");
      if ( postingDomain === undefined ) {
        postingDomain = "https://privlyalpha.org";
        ls.setItem("posting_content_server_url",postingDomain);
      }
      
      var postingApplicationUrl = "chrome://privly/content/privly-applications/" +
                                    postingApplicationName + "/new.html";
      postingProcess.postingApplicationStartingValue = info.text;
     
      postingProcess.postingResultTab = sourceTab;

      tabs.open({
        url: postingApplicationUrl,
        inNewWindow: true,
        onOpen: function(tab) {
          postingProcess.postingApplicationTab = tab;
          postingProcess.postingApplicationTab.on("close", function(tab) {
            postingProcess.tabClosed(tab, "postingApplication");
          });
        },
      }); 
      postingProcess.pendingPost = true;

      postingProcess.postingResultTab.on("close", function(tab) {
        postingProcess.tabClosed(tab, "resultTab");
      });

    } else {
      postingProcess.pendingNotif.show();
    }
  },

  tabClosed: function(tab, type) {

    if (postingProcess.postingApplicationTab === null ||
        postingProcess.postingResultTab === null) {
      return;
    }

    if (type === "resultTab") {
      postingProcess.postingApplicationTab.close();
    }
    postingProcess.pendingPost = false;

    postingProcess.postingResultTab = null;
    postingProcess.postingApplicationTab = null;
    postingProcess.postingApplicationStartingValue = "";

  },
};

exports.postingProcess = postingProcess;
