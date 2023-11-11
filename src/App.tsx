import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppRouter from './router';
import 'react-toastify/dist/ReactToastify.css';
import { useAppContext } from './store/context';
import { validateTokenApi } from './api/auth.api';
import { getDetailsEmployeeApi } from './api/employee.api';
import { PATHS } from './constants/paths';
import { getStompClient } from './config/stompJsConfig';
import { IMailBox } from './types/mail';
import 'sweetalert2/src/sweetalert2.scss'
import { IConversation } from './types/chat';
// import { getAllConversationsForEmployeeApi } from './api/chat.api';
import { Client } from '@stomp/stompjs';
import { BROKER_CHAT_CONVERSATIONS_LIST, BROKER_MAIL_BOXES_LIST } from './constants/brokers';

function App() {
  const { state, dispatch } = useAppContext();
  const auth = state.auth;
  const account = auth.data;
  const employee = state.employee;
  const { currentMailBox, mailBoxList } = state.mail;
  const { currentConversation, conversations } = state.chat;
  const navigate = useNavigate();

  const handleGetDetailsEmployee = async (token: string) => {
    try {
      const response = await getDetailsEmployeeApi(token);
      const employeeInfo = response.data;
      dispatch && dispatch({ type: "EMPLOYEE|ADD_DATA", payload: employeeInfo });
    } catch (error) { }
  }

  // const handleGetAllConversations = async (token: string) => {
  //   try {
  //     const res = await getAllConversationsForEmployeeApi(token);
  //     const conversations = res.data;
  //     dispatch && dispatch({
  //       type: "CHAT|SET|CONVERSATION_LIST",
  //       payload: conversations as IConversation[]
  //     })
  //   } catch (error) {
  //   }
  // }

  const handleValidateToken = async (token: string) => {
    try {
      const res = await validateTokenApi(token);
      const isValid = res.data;
      if (isValid) {
        handleGetDetailsEmployee(token);
        // handleGetAllConversations(token);
      } else {
        localStorage.removeItem('acc_info');
        dispatch && dispatch({ type: "AUTH|HANDLE_LOGOUT" });
        navigate(PATHS.LOGIN);
      }
    } catch (err) {
    }
  }

  const onSubscribeConversationsList = (client: Client, employee_id: number) => {
    client.subscribe(BROKER_CHAT_CONVERSATIONS_LIST(employee_id), (message) => {
      const data = JSON.parse(message.body) as IConversation[];
      dispatch && dispatch({
        type: "CHAT|SET|CONVERSATION_LIST",
        payload: data
      })
    })
  }

  const onSubscribeMailBoxesList = (client: Client, employee_id: number) => {
    client.subscribe(BROKER_MAIL_BOXES_LIST(employee_id), (message) => {
      const data = JSON.parse(message.body) as IMailBox[];

      // if (currentMailBox) {
      //   client.publish({
      //     destination: `/app/mail/load.mailbox.of.employee/${currentMailBox.id}`
      //   })
      // }

      dispatch && dispatch({
        type: "MAIL|SET|MAIL_BOXES_LIST",
        payload: data
      })
    })
  }

  useEffect(() => {
    if (account.token && account.role === "EMPLOYEE") {
      handleValidateToken(account.token);
    }
    // eslint-disable-next-line
  }, [account])

  useEffect(() => {
    const connectSocket = async (employeeId: number) => {
      try {
        // get stomp client
        const client = await getStompClient();
        // subscribe channels
        // client.subscribe(`/topic/mail/employee-mailboxes/${employeeId}`, (message) => {
        //   const data = JSON.parse(message.body) as IMailBox[];
        //   // const currentMailBox = state.mail.currentMailBox;

        //   if (currentMailBox) {
        //     client.publish({
        //       destination: `/app/mail/load.mailbox.of.employee/${currentMailBox.id}`
        //     })
        //   }

        //   dispatch && dispatch({
        //     type: "MAIL|SET|MAIL_BOXES_LIST",
        //     payload: data
        //   });


        // });
        // client.subscribe(`/topic/chat/conversations/${employeeId}`, (message) => {
        //   const data = (JSON.parse(message.body)) as IConversation[]
        //   if (dispatch) {
        //     if (currentConversation) {
        //       dispatch({
        //         type: "CHAT|SET|CURRENT_CONVERSATION",
        //         payload: data.filter(item => item.id === currentConversation.id)[0],
        //       })
        //     }

        //     dispatch({
        //       type: "CHAT|SET|CONVERSATION_LIST",
        //       payload: data
        //     })
        //   }
        // });
        onSubscribeConversationsList(client, employeeId);
        onSubscribeMailBoxesList(client, employeeId);
        // send message
        client.publish({
          destination: `/app/mail/load.mailboxes.of.employee/${employeeId}`
        });
        client.publish({
          destination: `/app/chat/get-conversations/${employeeId}`
        });
      } catch (error) {
        console.log(error);
      }
    };

    if (employee.data) {
      connectSocket(employee.data.id)
    }
    // eslint-disable-next-line
  }, [employee.data, dispatch])

  useEffect(() => {
    if (currentConversation && conversations.length) {
      conversations.forEach(item => {
        if (item.id === currentConversation.id) {
          dispatch && dispatch({
            type: "CHAT|UPDATE|CURRENT_CONVERSATION",
            payload: { ...item }
          })
        }
      })
    }
    // eslint-disable-next-line
  }, [conversations])

  useEffect(() => {
    if (currentMailBox && mailBoxList.length) {
      mailBoxList.forEach(item => {
        if (item.id === currentMailBox.id) {
          dispatch && dispatch({
            type: "MAIL|UPDATE|CURRENT_MAIL_BOX",
            payload: { ...item }
          })
        }
      })
    }
    // eslint-disable-next-line
  }, [mailBoxList])

  return (
    <>
      <AppRouter />
    </>
  );
}

export default App;
