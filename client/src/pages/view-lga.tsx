import axios from "axios"
import DataTable from "../components/data-table";
import { useEffect, useState } from "react"
import { createColumnHelper } from "@tanstack/react-table";
import { cn } from "../components/utils";


type LGACombinedResults = {
  results: LGAResults[];
  lgaName: string[];
}
type LGAResults = {
  polling_unit_uniqueid: string;
  party_abbreviation: string;
  party_score: number;
  result_id: number;
  polling_unit_name: string;
  lga_id: number;
  lga_name: string;
}
const columnHelper = createColumnHelper<LGAResults>()

const tableColumns = [
  columnHelper.accessor('polling_unit_name', {
    header: "Polling Unit",
    cell: info => info.getValue(),
    sortingFn: 'alphanumeric'

  }),
  columnHelper.accessor('lga_name', {
    header: 'Local Government Area',
    cell: info => info.renderValue(),
    sortingFn: 'alphanumeric'

  }),
  columnHelper.accessor('party_abbreviation', {
    header: "Party",
    cell: info => info.getValue(),
    sortingFn: 'alphanumeric'

  }),
  columnHelper.accessor('party_score', {
    header: 'Votes',
    cell: info => <i>{info.getValue().toLocaleString()}</i>,
    sortingFn: 'alphanumeric'

  }),

]
export default function ViewResultsLGA() {
  const [lgaResults, setLgaResults] = useState<LGACombinedResults>({
    results: [],
    lgaName: []
  })
  const [filteredResults, setFilteredResults] = useState<LGAResults[]>([])
  const [activeLga, setActiveLga] = useState(new Set())
  const [allStates, setAllStates] = useState<{ state_id: number, state_name: string }[]>([])
  const [activeState, setActiveState] = useState<number | string>(0)
  useEffect(() => {
    const getLgaResults = async (stateId: string | number) => {
      const res = await axios.get(import.meta.env.VITE_API_SERVER + "/api/get-lga-results/" + stateId)
      if (res.status < 400) {
        setLgaResults(res.data)
        setActiveLga(new Set(res.data.lgaName))
        setFilteredResults(res.data.results)
      }
    }
    if (Number(activeState) > 0) {
      getLgaResults(activeState)
    }
  }, [activeState])

  useEffect(() => {
    const getStates = async () => {
      const res = await axios.get(import.meta.env.VITE_API_SERVER + "/api/get-states")
      if (res.status < 400) {
        setAllStates(res.data)
      }
    }
    getStates()
  }, [])

  const toggleActiveLGA = (lga: string) => {
    const copy = new Set(activeLga);
    if (copy.has(lga)) {
      copy.delete(lga)
    } else {
      copy.add(lga)
    }
    const resultCopy = [...lgaResults.results]
    setActiveLga(copy);
    setFilteredResults(resultCopy.filter((res) =>
      copy.has(res.lga_name)
    ));
  }
  if (allStates.length <= 0) {
    return <></>
  }
  return (
    <div className="container">
      <div className="flex flex-col gap-1 pb-2">
        <label className="font-mono text-sm opacity-70 uppercase">Please Select State</label>
        <select className="uppercase" name="activeState" onChange={(event) => setActiveState(event.currentTarget.value)}>
          <option value={0} className="uppercase">-</option>
          {/* delta the only state with data in demo so pushing it first */}
          <option value={25} className="uppercase">{"Delta"}</option>

          {allStates.sort((a, b) => a.state_name > b.state_name ? 1 : -1).map(state =>
            <option value={state.state_id} key={state.state_id} className="uppercase">{state.state_name}</option>
          )}
        </select>
      </div>
      {lgaResults.lgaName.length > 0 ?
        <>
          <p className="pb-4 text-center">Select LGA results you want</p>
          <div className="flex gap-4 pb-4 flex-wrap px-4 justify-center">
            {lgaResults.lgaName.map((name) =>
              <span key={name} className={cn("rounded-xl px-6 py-1.5 cursor-pointer", activeLga.has(name) ? "bg-blue-500" : "bg-gray-200 text-black")} onClick={() => toggleActiveLGA(name)}>
                {name}
              </span>
            )}
          </div>
          <p className="text-sm opacity-90 text-center">click table head to sort</p>
          <DataTable
            data={filteredResults}
            columns={tableColumns}
          />
        </>
        :
        <>
          <h3 className="text-center">No Data Found</h3>
        </>
      }

    </div>
  )
}