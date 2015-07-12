# Messages #

## Content Script to Extension ##

| Name | Type | Purpose |
|------| ------------ | -------- |
| hyperlink | String | Notifies the extension about the popup menu option clicked by the user. |
| requestPrivlyStart | String | Requests the popup button state, i.e, whether injection is enabled/disabled. |
| postStatus | String | Indicates a successful or failed post. |
| requestBtnStatus | String | Requests the privly button status, i.e, whether Privly button is enabled/disabled. |
| privlyButtonClicked | Object | Contents: <ul><li>nodeId: Target Node identifier</li><li>text: Selection text</li><li>pageURL: Host page URL</li></ul> |
| messageSecret | String | Message secret provided by the privly application. |
| setPrivlyURL | String | Privly URL received from privly application. |
| requestInitialContent | String | Requests the intial content which is to be sent to the privly-application. |
| click | String | Notifies the extension about the click event on the notification popup/panel. |

## Extension to Content Script ##

| Name | Type | Purpose |
|------| ------------ | -------- |
| extensionMode | String | Depending on the extension mode(active/inactive), the popup displays the corresponding label. |
| privlyStart | String | Whether privly.js needs to start its execution or not. |
| postURL | Object | Contents: <ul><li>pageURL: Host page URL</li><li>privlyURL: Privly URL to be posted into the host page</li></ul> |
| privlyBtnStatus | String | Privly button status, i.e, whether Privly button is enabled/disabled. |
| initialContent | String | Initial content of the posting process. |
