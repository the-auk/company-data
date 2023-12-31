'use client';
import Image from 'next/image'
import styles from './page.module.css'
import { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [wikiSearch, setWikiSearch] = useState('');
  const [wikiData, setWikiData] = useState([]);
  const [companySearch, setCompanySearch] = useState('');
  const [companyData, setCompanyData] = useState([]);
  //const apiPath = 'https://company-data.vercel.app/';
  const apiPath ='http://localhost:3000/'

  const handleWikiSearch = async () => {
    const res = await axios.post(`${apiPath}/api/wiki`, {
      query: wikiSearch
    })
    if(res.data=="No Hits"){
      setWikiData(["No Hits"])
      return 
    }
    setWikiData([res.data])
  }

  const handleCompanySearch = async () => {
    const res = await axios.post(`${apiPath}/api/company`, {
      query: companySearch
    })
    if(res.data=="No Hits"){
      setCompanyData(["No Hits"])
      return 
    }
    setCompanyData(res.data)
  }

  return (
    <main className={styles.main}>
      <div className={styles.wikipediaSection}>
        Search Wikipedia
        <input value={wikiSearch} onChange={(e) => setWikiSearch(e.target.value)} className={styles.input}>

        </input>
        <div onClick={handleWikiSearch} className={styles.button}>
          Search
        </div>
        <div className={styles.results}>
          {wikiData?.map((elem) => {
            return <div key={Math.random()*900}>{JSON.stringify(elem)}</div>
          })}
        </div>
      </div>
      <div className={styles.companiesSection}>
        Gather company data
        <input value={companySearch} onChange={(e) => setCompanySearch(e.target.value)} className={styles.input} />

        <div onClick={handleCompanySearch} className={styles.button}>
          Gather
        </div>
        <div className={styles.results}>
          {companyData?.map((elem) => {
            return <div key={Math.random()*240000} className={styles.companyData}><pre>{JSON.stringify(elem, null, 2)}</pre></div>
          })}
        </div>
      </div>
    </main>
  )
}
