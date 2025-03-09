import { useEffect, useState } from "react"
import { PlusIcon } from "../icons/PlusIcon"
import { ShareIcon } from "../icons/ShareIcon"
import { useContent } from "../hooks/useContent"
import axios from "axios"
import { BACKEND_URL } from "../Config"
import { Button } from "../components/ui/Botton"
import { Card } from "../components/ui/Card"
import { CreateContentModal } from "../components/ui/CreateContentModel"
import { Sidebar } from "../components/ui/Sidebar"

export function Dashboard() {
  const [modalOpen, setModalOpen] = useState(false);
  const {contents, refresh} = useContent();
  const [username, setUsername] = useState("User"); 

  useEffect(() => {
    refresh();
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
        setUsername(storedUsername);
    }
}, [modalOpen]);

  return <div>
    <Sidebar />

      <CreateContentModal open={modalOpen} onClose={() => {
        setModalOpen(false);
      }} />
    <div className="p-4 ml-72 min-h-screen bg-gray-100 border-2">
    <div className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center mb-4">
                    <h1 className="text-xl font-semibold text-gray-700">Welcome, {username} 👋</h1>
      <div className="flex justify-end gap-4">
        <Button onClick={() => {
            setModalOpen(true)
        }} variant="primary" text="Add content" startIcon={<PlusIcon />}></Button>
        <Button onClick={async () => {
            const response = await axios.post(`${BACKEND_URL}/api/v1/brain/share`, {
                share: true
            }, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });
            const shareUrl = `http://localhost:5173/share/${response.data.hash}`;
            alert(shareUrl);
        }} variant="secondary" text="Share brain" startIcon={<ShareIcon />}></Button>
      </div>
        </div>

      <div className="flex gap-4 flex-wrap">
        {contents.map(({type, link, title}) => <Card 
            title={title}
            type={type}
            link={link}
        />)}
      </div>
    </div>
  </div>
}