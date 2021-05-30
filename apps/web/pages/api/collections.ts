import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import remark from 'remark'
import html from 'remark-html'
import { getCollectionData } from '../../lib/collections'

import { NextApiRequest, NextApiResponse } from 'next'
import { CollectionData } from "../../interfaces/interfaces"
import Collection from '../../components/Collection'

export default async function (req: NextApiRequest, res: NextApiResponse) {
  
    const body = req.body
    if (!body) res.status(400).json("no id provided")

    let colData: CollectionData

    switch(JSON.parse(body)){
        case "mysticwave": {
            colData = coll1Data
            break
        }
        case "mysticwave3": {
            colData = coll2Data
            break
        }
        case "mysticwave3": {
            colData = coll3Data
            break
        }
        default : {
            res.status(404).json("Wrong id for collection")
        }
    }

    res.status(200).json(colData)
}

const collection1Html = 
`
<div>
    <p>Next.js has two forms of pre-rendering: <strong>Static Generation</strong> and <strong>Server-side Rendering</strong>. The difference is in <strong>when</strong> it generates the HTML for a page.</p>
    <ul>
        <li><strong>Static Generation</strong> is the pre-rendering method that generates the HTML at <strong>build time</strong>. The pre-rendered HTML is then <em>reused</em> on each request.</li>
        <li><strong>Server-side Rendering</strong> is the pre-rendering method that generates the HTML on <strong>each request</strong>.</li>
    </ul>
    <Text>Importantly, Next.js lets you <strong>choose</strong> which pre-rendering form to use for each page. You can create a "hybrid" Next.js app by using Static Generation for most pages and using Server-side Rendering for others.</Text>
</div>
`
const coll1Data: CollectionData = { 
    contentHtml: collection1Html, 
    date: "2021-05-28",  
    id: "mysticwave",
    image: "/card-wave2.svg",
    title: "Mystical waves"

}

const collection2Html = 
`
<div>
    <p>Next.js has two forms of pre-rendering: <strong>Static Generation</strong> and <strong>Server-side Rendering</strong>. The difference is in <strong>when</strong> it generates the HTML for a page.</p>
    <ul>
        <li><strong>Static Generation</strong> is the pre-rendering method that generates the HTML at <strong>build time</strong>. The pre-rendered HTML is then <em>reused</em> on each request.</li>
        <li><strong>Server-side Rendering</strong> is the pre-rendering method that generates the HTML on <strong>each request</strong>.</li>
    </ul>
    <Text>Importantly, Next.js lets you <strong>choose</strong> which pre-rendering form to use for each page. You can create a "hybrid" Next.js app by using Static Generation for most pages and using Server-side Rendering for others.</Text>
</div>
`
const coll2Data: CollectionData = { 
    contentHtml: collection2Html, 
    date: "2021-06-28",  
    id: "mysticwave2",
    image: "/card-wave4.svg",
    title: "Mystical waves"

}

const collection3Html = 
`
<div>
    <p>Next.js has two forms of pre-rendering: <strong>Static Generation</strong> and <strong>Server-side Rendering</strong>. The difference is in <strong>when</strong> it generates the HTML for a page.</p>
    <ul>
        <li><strong>Static Generation</strong> is the pre-rendering method that generates the HTML at <strong>build time</strong>. The pre-rendered HTML is then <em>reused</em> on each request.</li>
        <li><strong>Server-side Rendering</strong> is the pre-rendering method that generates the HTML on <strong>each request</strong>.</li>
    </ul>
    <Text>Importantly, Next.js lets you <strong>choose</strong> which pre-rendering form to use for each page. You can create a "hybrid" Next.js app by using Static Generation for most pages and using Server-side Rendering for others.</Text>
</div>
`
const coll3Data: CollectionData = { 
    contentHtml: collection3Html, 
    date: "2021-07-28",  
    id: "mysticwave3",
    image: "/card-wave3.svg",
    title: "Mystical waves"

}