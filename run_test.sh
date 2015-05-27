# Script run on Travis CI
# Runs the Jetpack extension tests

# Set the firefox binary path
export JPM_FIREFOX_BINARY=$TRAVIS_BUILD_DIR/../firefox/firefox
# Run the tests, Save the output
jpm --prefs test.json run | tee test.output

# Check for test failure,
# Set the exit status accordingly.
isFail=`grep "FAILURE" test.output`
rm test.output

if [ ! -z "$isFail" ]; then
  echo "You have some work to do: tests are failing."
  exit 1
fi

exit 0
