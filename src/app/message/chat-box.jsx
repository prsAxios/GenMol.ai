import React, { useEffect, useState, useRef } from "react";
import { useChannel } from "ably/react";
import { useAbly } from "ably/react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { SendIcon } from "lucide-react";
import { useUser } from "../context/UserContext";
import { resizeBase64Img } from "@/lib/utils";
import {
  createGroup,
  getAllGroups,
  addMessageToGroup,
  getGroupMessages,
} from "@/lib/actions/group.actions";
import { getUserByEmail } from "@/lib/actions/user.actions";
import { useSession } from "next-auth/react";

function ChatBox() {
  const ably = useAbly();
  const [groups, setGroups] = useState([]);
  const [currentGroup, setCurrentGroup] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [receivedMessages, setMessages] = useState([]);
  const [user_, setUser_] = useState("");
  const channelName = "chat-demo1";
  const { data: session } = useSession();
  const user = useUser();
  const { channel } = useChannel(channelName, (message) => {
    if (message.data.group === currentGroup._id) {
      setMessages((prevMessages) => [...prevMessages, message.data]);
    }
  });

  const bottomRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [receivedMessages]);

  useEffect(() => {
    const fetchGroups = async () => {
      const groupsFromServer = await getAllGroups();
      const user_ = await getUserByEmail(session?.user?.email);
      setUser_(user_);
      setGroups(groupsFromServer);
    };
    fetchGroups();
  }, [session?.user?.email]);

  const handleCreateGroup = async (groupName) => {
    if (groupName && !groups.some((group) => group.name === groupName)) {
      const newGroup = await createGroup(groupName, user_._id);
      setGroups([...groups, newGroup]);
      setCurrentGroup(newGroup);
      setMessages([]);
    }
  };

  const handleJoinGroup = async (groupId) => {
    const selectedGroup = groups.find((group) => group._id === groupId);
    setCurrentGroup(selectedGroup);

    const groupMessages = await getGroupMessages(groupId);
    const formattedMessages = groupMessages.map((msg) => ({
      ...msg,
      connectionId: msg.sender._id,
      name: `${msg.sender.firstName} ${msg.sender.lastName}`,
      image: msg.sender.photo || "/default-avatar.png",
      data: msg.text,
      timestamp: msg.timestamp,
    }));

    setMessages(formattedMessages);
  };

  const sendChatMessage = async (messageText) => {
    try {
      if (currentGroup && channel) {
        const resizedImage = await resizeBase64Img(user.photo, 100, 100);

        const message = {
          group: currentGroup._id,
          name: `${user.firstName} ${user.lastName}`,
          image: resizedImage,
          data: messageText,
          timestamp: new Date().toISOString(),
          connectionId: ably.connection.id,
        };

        await channel.publish("chat-message", message);
        await addMessageToGroup(currentGroup._id, user_._id, messageText);

        setMessageText("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleFormSubmission = (event) => {
    event.preventDefault();
    sendChatMessage(messageText);
  };

  const renderedMessages = receivedMessages.map((message, index) => {
    const isMe = message.connectionId === ably.connection.id;
    return (
      <div
        key={index}
        className={`flex  ${isMe ? "justify-end" : "justify-start"} mb-4`}
      >
        <div
          className={`max-w-xs rounded-lg border border-black dark:border-white p-4 ${isMe
            ? "bg-primary text-white shadow-md"
            : "bg-gray-200 dark:bg-black-2 shadow-sm text-black dark:text-white"
            }`}
        >
          <div className="mb-2 flex items-center">
            <img
              src={message.image || "/default-avatar.png"}
              alt={message.name}
              className="mr-2 h-8 w-8 rounded-full"
            />
            <span className="text-sm text-black dark:text-white">
              {message.name}
            </span>
          </div>
          <p className="text-xs text-black dark:text-white">{message.data}</p>
          <span className="text-gray-400 text-xs text-black dark:text-white">
            {new Date(message.timestamp).toLocaleTimeString()}
          </span>
        </div>
      </div>
    );
  });

  return (
    <DefaultLayout>
      <div className="container mx-auto h-screen p-4 bg-white dark:bg-black-2 text-black dark:text-white">
        <h1 className="mb-6 text-3xl text-black dark:text-white">
          Drug Research chat
        </h1>

        <div className="mb-6 flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
          <input
            type="text"
            placeholder="Create new group"
            className="w-full rounded-lg border border-black dark:border-white bg-white dark:bg-black-2 p-4 outline-none focus:border-primary dark:focus:border-primary text-black dark:text-white"
            onKeyPress={(e) => {
              if (e.key === "Enter") handleCreateGroup(e.target.value);
            }}
          />
          <div className="relative w-full">
            <select
              onChange={(e) => handleJoinGroup(e.target.value)}
              className="w-full rounded-lg border border-black dark:border-white bg-white dark:bg-black-2 p-4 outline-none focus:border-primary dark:focus:border-primary text-black dark:text-white"
            >
              <option value="">Join a group</option>
              {groups.map((group) => (
                <option key={group._id} value={group._id} className="text-black dark:text-white">
                  {group.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {currentGroup && (
          <div className="rounded-lg border border-black dark:border-white p-6 bg-white dark:bg-black-2">
            <h2 className="mb-4 text-xl text-black dark:text-white">
              Current Group: {currentGroup.name}
            </h2>
            <div className="flex-1 overflow-y-auto p-4 bg-white dark:bg-black-2">
              {renderedMessages.length > 0 ? (
                <>
                  {renderedMessages}
                  <div ref={bottomRef}></div>
                </>
              ) : (
                <p className="text-gray-500 text-black dark:text-white">
                  No messages yet. Start chatting!
                </p>
              )}
            </div>
            <form onSubmit={handleFormSubmission} className="flex space-x-4">
              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Type a message..."
                className="w-full rounded-lg border border-black dark:border-white bg-white dark:bg-black-2 p-4 outline-none focus:border-primary dark:focus:border-primary text-black dark:text-white"
              />
              <button
                type="submit"
                disabled={!messageText.trim()}
                className="disabled:bg-gray-400 flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-white transition hover:bg-opacity-90 disabled:cursor-not-allowed"
              >
                <SendIcon className="mr-2" />
                Send
              </button>
            </form>
          </div>
        )}
      </div>
    </DefaultLayout>
  );
}

export default ChatBox;
