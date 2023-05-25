# EyeOfShmoggl-TogglUpload

### WIP

Ever have to retroactivley set a bunch of times in toggl? this script allows you to do that without having to use the slow Toggl GUI.

create a .env in the project root, and put your toggl api key and project you would like to update in it.
Eg... 
```
TOGGL_API_TOKEN=1234XYZABC
TOGGL_PROJECT_ID=12345678
```
Fake values obviously.. replace with your own. Can find them in toggle profile settings and project page. Dont store your env publicly because people can use your API key to cause mayhem.

## How to use

See src/app.js for examples. Right now you have to call `createDefaultWorkWeek` or 'createDefaultWorkday' manually. Will hopefully expand on this to automate more in the future if this proves useful.
