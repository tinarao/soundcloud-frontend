import { request } from "@/actions/auth";
import { BASIC_API_URL } from "@/lib/consts";
import axios from "axios";
import React from "react";

const Page = async () => {
  const client = await request();
  const best = await client<Track[]>(BASIC_API_URL + "track/hot");

  return (
    <div className="grid grid-cols-4">
      {best.data.map((track) => (
        <div className="col-span-1" key={track.id}>
          {track.title}
        </div>
      ))}
    </div>
  );
};

export default Page;
