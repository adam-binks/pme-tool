A guide to the Schematica codebase.

# Setting up

First, install [Node.js](https://nodejs.org/en/download/) and [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git).

Install dependencies by running `npm install`.

Run the local development server by running `npm run start`. You'll see live changes to the site at `http://localhost:3000/schematica`.

I'd recommend installing [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en) and [Redux DevTools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=en).


# Application state

The persistent application state is stored in Firestore, Google's cloud database. We use [react-redux-firebase](http://react-redux-firebase.com/) to sync the data into [Redux](https://redux.js.org/). The structure of the Firestore data is specified in `app/schema.ts`. Most of the functions to modify the Firestore data are in `state/mapFunctions.ts`. React components can access the Firestore data using calls to `useAppSelector()`, and there are helper selectors specified in `state/mapSelectors.ts`.

## Redux structure

Open the Redux developer tools and go to the "State" tab to explore the structure of the data.

### Firestore data in Redux

The Firestore data is stored in redux under `firestore.data` - this is where it's synced by react-redux-firebase using calls to `setListener()`. There's a few different pieces of data here:

* projects: Data about the open project. Each project can have multiple maps inside it, and each project has one recipe.
* maps: Data about the opened maps.
* nodes.{{map ID}}: The nodes for the map with the given ID are stored here. 
* arrows.{{map ID}}: The arrows for the map with the given ID are stored here.

### Local data in Redux

We also store some local, transient data in Redux, without syncing it to Firebase. These are visible in the root of the Redux state:

* local: See `state/localReducer.ts`. We store some computed data about the open map here:
    * classes: We cache the set of properties in each class. Properties (e.g. "=Headcount=") are parsed by the Codemirror editor in `map/editor/exposeProperties.ts`. They are stored in the Redux state so that all the nodes in the map that have this class can access the data. The nodes use this data to highlight in green their properties that are also present in their class.
    * elements: We store the {x, y} position of each node's arrowDot (the small purple dot), so that arrows that point to that node know where on the screen they should connect to.

* panes: We store the currently open panes: the user can open multiple maps from the same project side by side, in resizable panes. See `state/paneReducer.ts`

* history: For each map, we store a list of actions that can be undone, and a list of actions that can be redone. See `state/historyReducer.ts`.

### Dispatching actions

To dispatch an action that affects the state of the map, stored in Firestore, you'll need to do a few things:


# Code overview

There are two kinds of [Codemirror](https://codemirror.net/) editors in Schematica. `TextElement` is used in elements (nodes and arrows), in the map, and node and arrow types in the schema and library. `RecipeEditor` is used in the project's recipe, and in recipes in the library. Each uses a set of extensions that define their custom behaviour, such as syntax highlighting and embedding widgets - see `editor/extensions.ts` and `recipe/editor/recipeExtensions.ts`. We use [rodemirror](https://github.com/sachinraja/rodemirror) to wrap the Codemirror instances in React components (it's a bit more performant than the more popular [react-codemirror](https://github.com/uiwjs/react-codemirror)).

Everything else is a React component, which should be fairly self-documenting. We use [Tailwind](https://tailwindcss.com/) to style the React components with classes (e.g. `"bg-slate-500"` to set the background colour and `"m-auto"` to set an auto margin). Some components use [Mantine](https://mantine.dev/) components, which come pre-styled. For this early version of Schematica, we only target desktop devices and do not aim to support touch or mobile.