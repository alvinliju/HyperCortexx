"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useEffect } from "react";
import {useState} from 'react'
import YouTube from "react-youtube";

function SavedCard() {
    const [title, setTitle] = useState("");
    const [videoId, setVideoId] = useState("");
    const url = 'https://www.youtube.com/watch?v=4R4uTrA1vQ8&t=214s'
    const fuckit = async ()=>{
        const res = await fetch(`https://noembed.com/embed?url=${url}`)
        const data = await res.json()
        console.log(data)
        setTitle(data.title)
        console.log("title",title)
    }

    const youTubeGetID = () => {
        const res =  url.split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
        return (res[2] !== undefined) ? res[2].split(/[^0-9a-z_\-]/i)[0] : res[0];
    }

    useEffect(()=>{
        fuckit()
        setVideoId(youTubeGetID().toString())
        console.log(youTubeGetID().toString())
    }, [])

  return (
    <Card className="max-w-md">
      <CardContent className="p-4 overflow-hidden">
        <div className="flex flex-col gap-2">
            {title &&  <h2 className="text-2xl font-semibold mb-1">{title}</h2> }
          <YouTube
            className="w-full h-full"
            iframeClassName="w-full h-full"
            videoId={videoId}
          />
        </div>
      </CardContent>
    </Card>
  );
}

export default SavedCard;
