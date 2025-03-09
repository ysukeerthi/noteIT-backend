import { useRef, useState } from "react";
import { Input } from "./Input";
import axios from "axios";
import { CrossIcon } from "../../icons/CrossIcon";
import { Button } from "./Botton";
import { BACKEND_URL } from "../../Config";

enum ContentType {
    Youtube = "youtube",
    Twitter = "twitter"
}

interface CreateContentModalProps {
    open: boolean;
    onClose: () => void;
}

export function CreateContentModal({ open, onClose }: CreateContentModalProps) {
    const titleRef = useRef<HTMLInputElement>(null);
    const linkRef = useRef<HTMLInputElement>(null);
    const [type, setType] = useState(ContentType.Youtube);

    async function addContent() {
        let title = titleRef.current?.value?.trim();
        let link = linkRef.current?.value?.trim(); 
    
        if (!title || !link) {
            alert("Title and Link are required!");
            return;
        }
    
        if (type === ContentType.Youtube) {
            const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
            const match = link.match(youtubeRegex);
            if (match) {
                link = `https://www.youtube.com/embed/${match[1]}`;
            } else {
                alert("Invalid YouTube link.");
                return;
            }
        }
    
        if (type === ContentType.Twitter) {
            link = link.replace("x.com", "twitter.com");
        }
    
        await axios.post(`${BACKEND_URL}/api/v1/content`, {
            link,
            title,
            type
        }, {
            headers: {
                "Authorization": localStorage.getItem("token") || ""
            }
        });

        onClose();
    }

    return (
        <div>
            {open && (
                <div>
                    <div className="w-screen h-screen bg-slate-500 fixed top-0 left-0 opacity-60 flex justify-center"></div>
                    <div className="w-screen h-screen fixed top-0 left-0 flex justify-center">
                        <div className="flex flex-col justify-center">
                            <span className="bg-white opacity-100 p-4 rounded fixed">
                                <div className="flex justify-end">
                                    <div onClick={onClose} className="cursor-pointer">
                                        <CrossIcon />
                                    </div>
                                </div>
                                <div>
                                    <Input reference={titleRef} placeholder="Title" />
                                    <Input reference={linkRef} placeholder="Link" />
                                </div>
                                <div>
                                    <h1>Type</h1>
                                    <div className="flex gap-1 justify-center pb-2">
                                        <Button
                                            text="Youtube"
                                            variant={type === ContentType.Youtube ? "primary" : "secondary"}
                                            onClick={() => setType(ContentType.Youtube)}
                                        />
                                        <Button
                                            text="Twitter"
                                            variant={type === ContentType.Twitter ? "primary" : "secondary"}
                                            onClick={() => setType(ContentType.Twitter)}
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-center">
                                    <Button onClick={addContent} variant="primary" text="Submit" />
                                </div>
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
