import NotFound from './pages/404'
import ViewResultsLGA from './pages/view-lga';
import AddNewUnit from './pages/add-result';
import ViewResultsPollingUnit from './pages/view-polling';
import { Link, Route, Switch } from "wouter";
function Header() {
  const siteLinks = [
    "view-lga-results",
    "view-polling-result",
    "add-result"
  ]
  return (
    <main className='container py-12'>
      <div className='space-y-2 pb-8'>
        <h2 className='text-3xl tracking-tighter text-blue-500'>Submission - Kevin Igwebuike</h2>
        <p className='text-lg leading-8 opacity-70'>for bincom</p>
      </div>
      <div className='pb-12'>
        <div className='mx-auto flex gap-3 items-center justify-center rounded-md border-2 border-blue-500 bg-gray-600 text-white w-full md:w-max'>
          <Link to={"/"} className={" px-4 py-1.5 uppercase no-underline hover:bg-blue-500 rounded-md transition-all"}>
            Home
          </Link>
          {siteLinks.map(link => (
            <Link key={link} to={link} className={"px-4 py-1.5 uppercase no-underline hover:bg-blue-500 rounded-md transition-all"}>
              {link}
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
function App() {
  return (
    <>
      <Header />
      <Switch>
        <Route path="/" >
          <p className='container text-center'>Click on the links above to check the results</p>
        </Route>
        <Route path="/view-lga-results">
          <ViewResultsLGA />
        </Route>
        <Route path="/view-polling-result">
          <ViewResultsPollingUnit />
        </Route>
        <Route path="/add-result">
          <AddNewUnit />
        </Route>
        <Route><NotFound /></Route>
      </Switch>
    </>
  )
}
export default App
