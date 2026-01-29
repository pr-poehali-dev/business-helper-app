import { ChatGPTPlaygroundPage } from "@/components/extensions/chatgpt-polza/ChatGPTPlaygroundPage";

const API_URL = "https://functions.poehali.dev/e1b7d9b7-1ca8-4ea7-b200-73f4f840c1d6";

const ChatGPTPage = () => {
  return (
    <ChatGPTPlaygroundPage
      apiUrl={API_URL}
      defaultModel="openai/gpt-4o-mini"
    />
  );
};

export default ChatGPTPage;
