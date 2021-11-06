import 'antd/dist/antd.css'
import { Modal, Input, Select, Form, Card, Button } from 'antd'
import axios from 'axios'
import { useEffect, useState } from 'react'
import {
  UserAddOutlined,
  PhoneOutlined,
  MailOutlined,
  DeleteOutlined,
  FormOutlined,
} from '@ant-design/icons'

export const ResidentsList = (props) => {
  const [residents, setResidents] = useState()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [form, setForm] = useState({
    id: 0,
    name: '',
    phone: '',
    email: '',
    bindId: 0,
  })

  useEffect(() => {
    async function fetchList() {
      const res = await axios.get(
        `https://dispex.org/api/vtest/HousingStock/clients?addressId=${props.currentFlatId}`,
        {
          headers: {
            accept: 'text / plain',
            'Content-Type': 'application/json-patch+json',
          },
        }
      )
      setResidents(res.data)
    }
    if (props.currentFlatId !== undefined) {
      fetchList()
    }
    props.setNewResident(false)
  }, [props])

  const deleteHandler = async (resident) => {
    await axios.delete(
      `https://dispex.org/api/vtest/HousingStock/bind_client/${resident.bindId}`
    )

    props.setNewResident(true)
  }

  const changeResidentsHandler = async (form) => {
    await axios.post(
      'https://dispex.org/api/vtest/HousingStock/client',
      {
        ...form,
      },
      {
        headers: {
          accept: 'text / plain',
          'Content-Type': 'application/json-patch+json',
        },
      }
    )
    props.setNewResident(true)
  }

  const showModal = (resident) => {
    setForm(resident)
    setIsModalVisible(true)
  }

  const handleOk = () => {
    setIsModalVisible(false)
    changeResidentsHandler(form)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  const changeHandler = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  const { Option } = Select
  const selectBefore = (
    <Select defaultValue="+7" className="select-before">
      <Option value="+7">+7</Option>
      <Option value="8">8</Option>
    </Select>
  )

  if (!residents) {
    return <div> </div>
  }

  return (
    <div
      style={{
        margin: '20px',
        display: 'flex',
        justifyContent: 'start',
        flexWrap: 'wrap',
      }}
    >
      {residents.map((e, ind) => (
        <Card size="small" style={{ width: 300, margin: '50px' }} key={ind}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <UserAddOutlined
                style={{
                  color: 'blue',
                  paddingRight: '20px',
                  fontSize: '35px',
                }}
              />
            </div>
            <div>
              {e.name ? <p style={{ fontWeight: 'bold' }}>{e.name}</p> : null}
              <p style={{ color: 'green' }}>
                <PhoneOutlined style={{ paddingRight: '10px' }} />
                {e.phone}
              </p>
              {e.email ? (
                <p>
                  <MailOutlined style={{ paddingRight: '10px' }} />
                  {e.email}
                </p>
              ) : null}
            </div>
            <div>
              <Button onClick={() => showModal(e)}>
                <FormOutlined />
              </Button>
              <Modal
                visible={isModalVisible}
                onOk={handleOk}
                okText="Изменить данные"
                onCancel={handleCancel}
                cancelText="Отмена"
              >
                <h2>
                  <UserAddOutlined
                    style={{
                      color: 'blue',
                      paddingRight: '20px',
                    }}
                  />
                  Добавить жильца
                </h2>
                <Form
                  layout="vertical"
                  style={{ display: 'flex', flexWrap: 'wrap' }}
                >
                  <Form.Item label="Телефон" required style={{ width: '40%' }}>
                    <Input
                      addonBefore={selectBefore}
                      placeholder="телефон"
                      onChange={changeHandler}
                      name="phone"
                      value={form.phone}
                    />
                  </Form.Item>
                  <Form.Item label="e-mail" style={{ width: '60%' }}>
                    <Input
                      placeholder="e-mail"
                      onChange={changeHandler}
                      name="email"
                      value={form.email}
                    />
                  </Form.Item>
                  <Form.Item label="Ф.И.О." style={{ width: '100%' }}>
                    <Input
                      value={form.name}
                      placeholder="Ф.И.О."
                      onChange={changeHandler}
                      name="name"
                    />
                  </Form.Item>
                </Form>
              </Modal>
              <Button onClick={() => deleteHandler(e)}>
                <DeleteOutlined />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
