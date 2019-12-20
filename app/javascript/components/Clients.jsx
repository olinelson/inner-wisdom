import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  Modal,
  Search,
  Menu,
  Icon,
  Form,
  Checkbox,
  Container
} from "semantic-ui-react";
import moment from "moment";
import { debounce } from "debounce";
import styled from "styled-components";
import Message from "./Message";

const uuidv1 = require("uuid/v1");

function Clients(props) {
  const [first_name, setFirst_name] = useState("");
  const [last_name, setLast_name] = useState("");
  const [email, setEmail] = useState("");
  const [sendWelcomeEmail, setSendWelcomeEmail] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState();
  const [notifications, setNotifications] = useState([]);

  const [users, setUsers] = useState(props.users);

  const tempPassword = Math.random()
    .toString(36)
    .slice(2);

  const csrfToken = document.querySelectorAll('meta[name="csrf-token"]')[0]
    .content;

  useEffect(() => {
    const timer = setTimeout(() => {
      if (notifications === []) return () => clearTimeout(timer);
      if (notifications.length > 1) {
        let newVal = [...notifications];
        newVal.pop();
        setNotifications(newVal);
      } else if (notifications.length === 1) {
        setNotifications([]);
      } else {
        return () => clearTimeout(timer);
      }
    }, 10000);
    return () => clearTimeout(timer);
  }, [notifications]);

  const createUserHandler = async e => {
    setLoading(true);
    let newUser = {
      first_name,
      last_name,
      email,
      password: tempPassword,
      sendWelcomeEmail
    };
    const res = await fetch(`${process.env.BASE_URL}/api/v1/clients`, {
      method: "POST",
      body: JSON.stringify({
        user: newUser
      }),
      headers: {
        "X-CSRF-Token": csrfToken,
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest"
      }
    });
    try {
      const json = await res.json();
      setLoading(false);
      setModalOpen(false);
      setUsers([...users, json.newUser]);
    } catch (error) {
      setNotifications([
        { id: new Date(), type: "alert", message: "Could not create user" },
        ...notifications
      ]);
      console.error("Error:", error);
      setLoading(false);
      setModalOpen(false);
    }
  };

  const userFilter = (user, query) => {
    query = query.toLowerCase();
    if (user.first_name.toLowerCase().includes(query)) return true;
    if (user.last_name.toLowerCase().includes(query)) return true;
    if (user.email.includes(query)) return true;
    return false;
  };

  const handleResultSelect = (e, { result }) => {
    window.location = `/clients/${result.id}`;
  };

  const handleSearchChange = (e, { value }) => {
    let allUsers = props.users;
    let filtered = allUsers.filter(u => userFilter(u, value));
    let result = filtered.map(u => {
      return { title: `${u.first_name} ${u.last_name}`, id: u.id };
    });
    setFilteredUsers(result);
  };

  return (
    <>
      <div style={{ position: "fixed", right: "1rem", zIndex: "100" }}>
        {notifications.map(n => (
          <Message key={uuidv1()} message={n} />
        ))}
      </div>
      <Container>
        <h1>Clients</h1>
        <Menu fluid secondary>
          <Menu.Item
            content={
              <Button
                basic
                onClick={() => setModalOpen(true)}
                icon='plus'
                content='Create'
              />
            }
          />

          <Menu.Item position='right'>
            <Search
              loading={loading}
              onResultSelect={(e, { result }) =>
                handleResultSelect(e, { result })
              }
              onSearchChange={debounce(handleSearchChange, 500, {
                leading: true
              })}
              results={filteredUsers}
            />
          </Menu.Item>
        </Menu>

        <Card.Group stackable doubling centered>
          {users.map(user => {
            return (
              <Card
                onClick={() => (window.location = `/clients/${user.id}`)}
                key={user.id}
              >
                <Card.Content>
                  <Card.Header>
                    <Icon name='user' />
                    {user.first_name + " " + user.last_name}
                  </Card.Header>
                  <Card.Meta>
                    {moment(user.created_at).format("MM/DD/YYYY")}
                  </Card.Meta>
                  {/* <Card.Content extra>
                                <Label
                                    icon="history"
                                    // content={pastAppointments.length}
                                    content={100}
                                />
                                <Label
                                    icon="calendar"
                                    // content={futureAppointments.length}
                                    content={10}
                                />
                            </Card.Content> */}
                </Card.Content>
              </Card>
            );
          })}
        </Card.Group>

        <Modal closeIcon onClose={() => setModalOpen(false)} open={modalOpen}>
          <Modal.Header>Create New Client</Modal.Header>
          <Modal.Content image>
            <Modal.Description>
              <Form onSubmit={e => createUserHandler(e)}>
                <Form.Field>
                  <label>First Name</label>
                  <input
                    value={first_name}
                    onChange={e => setFirst_name(e.target.value)}
                    required
                    placeholder='First Name'
                  />
                </Form.Field>
                <Form.Field>
                  <label>Last Name</label>
                  <input
                    value={last_name}
                    onChange={e => setLast_name(e.target.value)}
                    required
                    placeholder='Last Name'
                  />
                </Form.Field>
                <Form.Field>
                  <label>Email</label>
                  <input
                    value={email}
                    type='email'
                    onChange={e => setEmail(e.target.value)}
                    required
                    placeholder='newclient@gmail.com'
                  />
                </Form.Field>
                <Form.Field>
                  <Checkbox
                    checked={sendWelcomeEmail}
                    onChange={() => setSendWelcomeEmail(!sendWelcomeEmail)}
                    label='Send User Welcome Email'
                  />
                </Form.Field>
                <Button loading={loading} type='submit'>
                  Create
                </Button>
              </Form>
            </Modal.Description>
          </Modal.Content>
        </Modal>
      </Container>
    </>
  );
}
export default Clients;
