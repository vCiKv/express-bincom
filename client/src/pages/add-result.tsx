import axios from "axios"
import { Input } from "../components/input"
import { useEffect, useState } from "react"
import type { PollingUnitDetail } from "./view-polling"

function AddPollingUnitResults() {
  const [userName, setUserName] = useState("")
  const [confirmName, setConfirmName] = useState(false)
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState(
    {
      pollingUnitUniquieid: "",
      partyAbbreviation: "",
      partyScore: 0,
    }
  )
  const [partyList, setPartyList] = useState<{ partyname: string }[]>([])
  const [puDetails, setPuDetails] = useState<PollingUnitDetail[]>([])

  const handleInput = (event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(p => ({ ...p, [event.target.name]: event.target.value }))
  }
  useEffect(() => {
    const getParties = async () => {
      const res = await axios.get(import.meta.env.VITE_API_SERVER + "/api/get-parties")
      if (res.status < 400) {
        setPartyList(res.data)
      }
    }
    const getPuDetails = async () => {
      const res = await axios.get(import.meta.env.VITE_API_SERVER + "/api/get-pu")
      if (res.status < 400) {
        setPuDetails(res.data)
      }
    }
    getParties()
    getPuDetails()

  }, [])
  const addVotes = async () => {
    if (loading) {
      return
    }
    if (!userName || userName === "") {
      return
    }
    const { partyScore, partyAbbreviation, pollingUnitUniquieid } = formData
    if (partyScore % 1 !== 0) {
      return
    }
    if (partyAbbreviation === "" || pollingUnitUniquieid === "") {
      return
    }
    setLoading(true)
    if (loading) {
      setTimeout(() => {
        setLoading(false)
      }, 15000);
    }
    await axios.post(import.meta.env.VITE_API_SERVER + "/api/add-pu-result", {
      pollingUnitId: pollingUnitUniquieid,
      party: partyAbbreviation,
      user: userName,
      partyScore: partyScore
    }).then((res) => {
      if (res.status === 201) {
        alert("result added successfully")
      } else {
        alert("error adding result")
      }
    })
    setLoading(false)

  }
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-2 justify-center items-center">
        {
          (!confirmName) && (
            <>
              <Input
                value={userName}
                onChange={(event) => setUserName(event.target.value)}
                label="data-entry name"
                className="max-w-md"
              />
              <button onClick={() => setConfirmName(true)}>Confirm</button>
            </>
          )
        }
      </div>
      <div>
        {
          (confirmName) && (
            <form className="space-y-4 md:w-max w-full mx-auto">
              <div className="flex flex-col gap-1">
                <label className="font-mono text-sm opacity-70 uppercase">Please Select a Polling unit</label>
                <select className="uppercase" name="pollingUnitUniquieid" value={formData.pollingUnitUniquieid} onChange={handleInput}>
                  <option value={""} className="uppercase">-</option>
                  {puDetails.sort((a, b) => a.polling_unit_name > b.polling_unit_name ? 1 : -1).map(pu =>
                    <option value={pu.uniqueid} key={pu.uniqueid} className="uppercase">{pu.polling_unit_name} - {pu.polling_unit_number}</option>
                  )}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-mono text-sm opacity-70 uppercase">Select A Party</label>
                <select className="uppercase" name="partyAbbreviation" value={formData.partyAbbreviation} onChange={handleInput}>
                  <option value={""} className="uppercase">-</option>
                  {partyList.map(party =>
                    <option value={party.partyname} key={party.partyname} className="uppercase">{party.partyname}</option>
                  )}
                </select>
              </div>
              <Input
                name="partyScore"
                label="party votes"
                type="number"
                onChange={handleInput}
              />
              <button onClick={addVotes} type="button" disabled={loading}>Submit Votes</button>
            </form>
          )
        }
      </div>
    </div>
  )
}
export default function AddNewUnit() {
  return (
    <div className="container">
      <AddPollingUnitResults />
    </div>
  )
}