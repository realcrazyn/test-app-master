import { useState } from 'react'
import { AdressForm } from './components/Form'
import { ResidentsList } from './components/List'
import { Residents } from './components/Residents'

function App() {
  const [currentFlatId, setCurrentFlatId] = useState()
  const [newResident, setNewResident] = useState(false)

  return (
    <div style={{ width: '1200px', margin: '0 auto', marginTop: '50px' }}>
      <AdressForm setCurrentFlatId={setCurrentFlatId} />
      <Residents
        currentFlatId={currentFlatId}
        setNewResident={setNewResident}
      />
      <ResidentsList
        currentFlatId={currentFlatId}
        newResident={newResident}
        setNewResident={setNewResident}
      />
    </div>
  )
}

export default App
