import { AutoComplete, Form } from 'antd'
import axios from 'axios'
import { useEffect, useState } from 'react'
import '../../node_modules/antd/dist/antd.css'

export const AdressForm = (props) => {
  const [form] = Form.useForm()

  const [houseValue, setHouseValue] = useState()
  const [streetValue, setStreetValue] = useState()
  const [flatValue, setFlatValue] = useState()

  const [streets, setStreets] = useState()
  const [flats, setFlats] = useState()
  const [houses, setHouses] = useState()

  useEffect(() => {
    async function fetchStreets() {
      const res = await axios.get(
        'https://dispex.org/api/vtest/Request/streets'
      )
      const data = res.data
        .filter((e) => e.cityId === 1)
        .map((e) => ({ value: e.nameWithPrefix, id: e.id }))
      setStreets(data)
    }
    fetchStreets()
  }, [])

  useEffect(() => {
    async function fetchHouses() {
      setHouses()
      setFlats()
      setHouseValue('')
      setFlatValue('')
      if (streetValue) {
        const ID = streets.filter((e) => e.value === streetValue)
        if (ID.length === 1) {
          const res = await axios.get(
            `https://dispex.org/api/vtest/Request/houses/${ID[0].id}`
          )
          const data = res.data.map((e) => ({ value: e.name, id: e.id }))
          setHouses(data)
        }
      }
    }
    fetchHouses()
  }, [streetValue, streets])

  useEffect(() => {
    async function fetchFlats() {
      setFlats()
      setFlatValue('')
      if (houseValue) {
        const ID = houses.filter((e) => e.value === houseValue)
        if (ID.length === 1) {
          const res = await axios.get(
            `https://dispex.org/api/vtest/Request/house_flats/${ID[0].id}`
          )
          const data = res.data.map((e) => ({ value: e.name, id: e.id }))
          setFlats(data)
        }
      }
    }
    fetchFlats()
  }, [houseValue, houses])

  useEffect(() => {
    if (flats) {
      const ID = flats.filter((e) => e.value === flatValue)
      if (ID.length === 1) {
        props.setCurrentFlatId(ID[0].id)
      }
    }
  }, [flatValue, flats, props])

  if (!streets) {
    return <div>Loading</div>
  }

  return (
    <Form form={form} layout="vertical">
      <Form.Item label="Адрес" required layout="inline">
        <AutoComplete
          style={{
            width: 200,
          }}
          options={streets}
          placeholder="Улица"
          filterOption={(inputValue, option) =>
            option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
          }
          onChange={setStreetValue}
        />
        <AutoComplete
          style={{
            width: 200,
          }}
          disabled={houses ? false : true}
          options={houses ? houses : null}
          value={houseValue}
          onChange={setHouseValue}
          placeholder="Дом"
          filterOption={(inputValue, option) =>
            option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
          }
        />
        <AutoComplete
          style={{
            width: 200,
          }}
          disabled={flats ? false : true}
          options={flats ? flats : null}
          value={flatValue}
          onChange={setFlatValue}
          placeholder="Кв./офис"
          filterOption={(inputValue, option) =>
            option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
          }
        />
      </Form.Item>
      <p style={{ fontWeight: 'bold' }}>
        {streetValue && houseValue && flatValue
          ? `ул. ${streetValue}, д. ${houseValue}, ${flatValue}`
          : null}
      </p>
    </Form>
  )
}
