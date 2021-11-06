import { Modal, Button, Input, Select, Form, Alert } from 'antd'
import React, { useState } from 'react'
import 'antd/dist/antd.css'
import { UserAddOutlined } from '@ant-design/icons'
import axios from 'axios'

export const Residents = (props) => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [phoneCheck, setPhoneCheck] = useState(false)
  const [form, setForm] = useState({
    Id: Math.floor(Math.random() * 1000000),
    Name: '',
    Phone: '',
    Email: '',
  })

  const createResidents = async (form, currentFlatId) => {
    const res = await axios.post(
      'https://dispex.org/api/vtest/HousingStock/client',
      {
        id: form.Id,
        name: form.Name,
        phone: form.Phone,
        email: form.Email,
        bindId: currentFlatId,
      },
      {
        headers: {
          accept: 'text / plain',
          'Content-Type': 'application/json-patch+json',
        },
      }
    )
    const ID = res.data.id
    if (res.status === 200) {
      await axios.put('https://dispex.org/api/vtest/HousingStock/bind_client', {
        AddressId: currentFlatId,
        ClientId: ID,
      })
    }
    props.setNewResident(true)
    setForm({
      Id: Math.floor(Math.random() * 1000000),
      Name: '',
      Phone: '',
      Email: '',
    })
  }

  const changeHandler = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleOk = () => {
    if (form.Phone) {
      setPhoneCheck(false)
      setIsModalVisible(false)
      createResidents(form, props.currentFlatId)
    } else {
      setPhoneCheck(true)
    }
  }

  const handleCancel = () => {
    setIsModalVisible(false)
    setPhoneCheck(false)
  }

  const { Option } = Select
  const selectBefore = (
    <Select defaultValue="+7" className="select-before">
      <Option value="+7">+7</Option>
      <Option value="8">8</Option>
    </Select>
  )

  return (
    <>
      <Button
        type="primary"
        onClick={showModal}
        disabled={props.currentFlatId !== undefined ? false : true}
      >
        Добавить жильца
      </Button>
      <Modal
        visible={isModalVisible}
        onOk={handleOk}
        okText="Добавить"
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
        <Form layout="vertical" style={{ display: 'flex', flexWrap: 'wrap' }}>
          <Form.Item label="Телефон" required style={{ width: '40%' }}>
            <Input
              addonBefore={selectBefore}
              placeholder="телефон"
              onChange={changeHandler}
              name="Phone"
              value={form.Phone}
            />
          </Form.Item>
          <Form.Item label="e-mail" style={{ width: '60%' }}>
            <Input
              placeholder="e-mail"
              onChange={changeHandler}
              name="Email"
              value={form.Email}
            />
          </Form.Item>
          <Form.Item label="Ф.И.О." style={{ width: '100%' }}>
            <Input
              placeholder="Ф.И.О."
              onChange={changeHandler}
              name="Name"
              value={form.Name}
            />
          </Form.Item>
        </Form>
        {phoneCheck ? <Alert message="Введите телефон" type="error" /> : null}
      </Modal>
    </>
  )
}
