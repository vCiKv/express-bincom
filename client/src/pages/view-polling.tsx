import axios from "axios"
import { useEffect, useMemo, useState } from "react"
import DataTable from "../components/data-table";
import { createColumnHelper } from "@tanstack/react-table";

export type PollingUnitDetail = {
  uniqueid: number; polling_unit_name: string; polling_unit_number: string;
}
type PollingUnitResultsDetail = {
  polling_unit_uniqueid: string;
  party_abbreviation: string;
  party_score: number;
  entered_by_user: string;
}
const columnHelper = createColumnHelper<PollingUnitResultsDetail>()

export default function ViewResultsPollingUnit() {
  const [puDetails, setPuDetails] = useState<PollingUnitDetail[]>([])
  const [activePuId, setActivePuId] = useState<number>(0)
  const [activeUnitName, setActiveUnitName] = useState<string>("")
  const [tableData, setTableData] = useState<PollingUnitResultsDetail[]>([])
  const tableColumns = useMemo(() => [
    columnHelper.accessor('polling_unit_uniqueid', {
      header: "Polling Unit",
      cell: activeUnitName,
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
    columnHelper.accessor('entered_by_user', {
      header: () => 'Entered By',
      cell: info => info.renderValue(),
      sortingFn: 'alphanumeric'

    }),
  ], [activeUnitName])
  useEffect(() => {
    //get all polling units
    const getPuDetails = async () => {
      const res = await axios.get(import.meta.env.VITE_API_SERVER + "/api/get-pu")
      if (res.statusText.toLowerCase() === "ok") {
        setPuDetails(res.data)
      }
    }
    getPuDetails()
  }, [])
  const findPollingName = (id: number) => {
    for (const pu of puDetails) {
      if (pu.uniqueid === id) {
        setActiveUnitName(pu.polling_unit_name)
        return
      }
    }
  }
  const updateTable = async () => {
    if (isNaN(activePuId) || activePuId <= 0) {
      return
    }
    const res = await axios.get(import.meta.env.VITE_API_SERVER + "/api/get-pu/" + activePuId)
    if (res.statusText.toLowerCase() === "ok") {
      findPollingName(activePuId)
      setTableData(res.data)
    }
  }
  if (puDetails.length <= 0) {
    return <></>
  }
  return (
    <div className="container">
      <div className="flex flex-row items-end justify-center border border-blue-500 rounded-md gap-4 md:w-max w-full p-4 mx-auto">
        <div className="flex flex-col gap-1">
          {/* select unit */}
          <label className="font-mono text-sm opacity-70">Please Select a Polling unit</label>
          <select className="uppercase" value={activePuId} onChange={(event) => setActivePuId(Number(event.target.value))}>
            <option value={""} className="uppercase">-</option>
            {puDetails.sort((a, b) => a.polling_unit_name > b.polling_unit_name ? 1 : -1).map(pu =>
              <option value={pu.uniqueid} key={pu.uniqueid} className="uppercase">{pu.polling_unit_name} - {pu.polling_unit_number}</option>
            )}
          </select>
        </div>
        <div>
          <button onClick={updateTable}>Check Polling Unit</button>
        </div>
      </div>
      <div className="py-12">
        {tableData.length > 0 ? (
          <>
            <h3 className="pb-4">Individual Poling Results</h3>
            <p className="text-sm opacity-90 text-center">click table head to sort</p>
            <DataTable
              data={tableData}
              columns={tableColumns}
            />
          </>
        ) : (
          <>
            <h3 className="text-center">No Data Found</h3>
          </>
        )}
      </div>
    </div>
  )
}