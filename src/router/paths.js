/**
 * Define all of your application routes here
 * for more information on routes, see the
 * official documentation https://router.vuejs.org/en/
 */

export default [{
    path: '/example',
    name: 'example',
    view: 'ExamplePage'
  },
  {
    path: '/notes',
    // Relative to /src/views
    name: 'Notes',
    view: 'NotesPage'
  },
  {
    path: '/tutorial',
    // Relative to /src/views
    name: 'Tutorial',
    view: 'TutorialPage'
  },
]