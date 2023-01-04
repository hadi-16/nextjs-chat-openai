import Head from "next/head";
import { Fragment, useEffect, useRef, useState } from "react";
import { ChatStore } from "../store/ChatStore";
import dayjs from "dayjs";
var relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);
import {
  IconHand,
  IconLoadingHourglass,
  IconLoadingSend,
  IconProfile,
  IconRobot,
  IconSend,
  IconTrash,
} from "../components/Icon";
import ClientSide from "../components/ClientSide";
import AnimateChats from "../components/AnimateChats";

export default function PageHome() {
  // store chats
  const { chats, addChat, loading, removeAllChat, removeOneChat } = ChatStore(
    (state) => state
  );

  // state text
  const [text, setText] = useState("");

  // handler form submit
  const handlerSubmitChat = (event) => {
    event.preventDefault();
    // if text greater than 0 and less than 300 character do it
    if (text.length > 0 && text.length <= 300) {
      // store text to addChat store
      addChat(text);
      // set text to default
      setText("");
    }
  };

  // handle remove all chats
  const handlerRemoveAllChats = () => {
    if (confirm(`Are you sure to delete all chat?`)) {
      removeAllChat();
    }
  };

  // handle remove one chat
  const handlerRemoveOneChat = (item) => {
    if (confirm(`Are you sure to delete chat ${item.chat}?`)) {
      removeOneChat(item);
    }
  };

  // format date
  const formatDate = (date) => {
    return dayjs().to(dayjs(date));
  };

  // ref
  const chatRef = useRef(null);
  const loadingRef = useRef(null);

  useEffect(() => {
    // if there is a new chat scroll to them
    if (chats && chatRef?.current) {
      chatRef?.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chats, chatRef]);

  useEffect(() => {
    // if there is a loading scroll to them
    if (loading && loadingRef?.current) {
      loadingRef?.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [loading, loadingRef]);

  return (
    // client side it means client side rendering
    <ClientSide>
      <Head>
        <title>NextJS Chat OpenAI</title>
      </Head>
      <div className="flex flex-col items-center justify-center w-screen min-h-screen bg-gray-100 text-gray-800 md:p-10">
        <div className="flex flex-col flex-grow w-full max-w-xl bg-white shadow-xl rounded-lg overflow-hidden">
          {/* header */}
          <div className="bg-white border-b shadow p-2 md:p-4 fixed top-0 w-full max-w-xl z-20">
            <div className="relative flex justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <span className="absolute text-green-500 translate-x-3 translate-y-2 bottom-0 right-0">
                    <svg width="20" height="20">
                      <circle cx="5" cy="5" r="5" fill="currentColor"></circle>
                    </svg>
                  </span>

                  <IconRobot />
                </div>

                <div className="flex flex-col leading-tight">
                  <div className="mt-1 flex items-center">
                    <span className="text-gray-700 mr-3">Bot OpenAI</span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {loading ? "Typing..." : "Online"}
                  </span>
                </div>
              </div>

              {chats.length > 1 && (
                <div
                  className="flex items-center px-1"
                  onClick={handlerRemoveAllChats}
                >
                  <button type="button">
                    <IconTrash />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* chats */}
          <div className="flex flex-col flex-grow h-0 p-4 overflow-auto py-20 md:py-10">
            <>
              {chats?.length === 0 && (
                <div
                  className="flex items-center justify-center h-full w-full"
                  ref={chatRef}
                >
                  <div className="text-center text-gray-600">
                    <p>No message here...</p>
                    <p>Send a message or tap the greeting icon below</p>
                    <div className="cursor-pointer">
                      <button
                        type="button"
                        className="my-10"
                        onClick={() => addChat("Hello, how are you?")}
                      >
                        <IconHand loading={loading} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
              <AnimateChats>
                {chats?.length > 0 &&
                  chats?.map((item, index) => (
                    <Fragment key={index}>
                      <div className="flex w-full mt-2 space-x-3 max-w-xs ml-auto justify-end">
                        <div>
                          <div className="bg-blue-600 text-white p-3 rounded-l-lg rounded-br-lg">
                            <p className="text-sm leading-relaxed">
                              {item.chat}
                            </p>
                          </div>
                          <span className="text-xs text-gray-500 leading-none">
                            {formatDate(item.date)}
                          </span>
                        </div>

                        <div onClick={() => handlerRemoveOneChat(item)}>
                          <IconProfile />
                        </div>
                      </div>
                      <div className="flex w-full mt-2 space-x-3 max-w-xs">
                        <div>
                          <IconRobot />
                        </div>
                        <div>
                          <div className="bg-gray-200 p-3 rounded-r-lg rounded-bl-lg">
                            <p className="text-sm leading-relaxed">
                              {item.answer}
                            </p>
                          </div>
                          <span className="text-xs text-gray-500 leading-none">
                            {formatDate(item.date)}
                          </span>
                        </div>
                      </div>
                    </Fragment>
                  ))}
              </AnimateChats>
              {loading && (
                <div
                  className="text-center flex justify-center py-4"
                  ref={loadingRef}
                >
                  <IconLoadingHourglass />
                </div>
              )}
            </>
          </div>

          {/* input chat */}
          <div className="bg-gray-200 shadow border-t p-2 fixed bottom-0 w-full max-w-xl">
            <div className="relative">
              <form onSubmit={handlerSubmitChat}>
                <input
                  className="flex items-center h-10 w-full rounded px-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-600 input-chat"
                  type="text"
                  placeholder="Type your message…"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
                <button
                  type="submit"
                  className="absolute right-8 top-2 change-color fill-gray-300"
                >
                  {loading ? <IconLoadingSend /> : <IconSend />}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </ClientSide>
  );
}
