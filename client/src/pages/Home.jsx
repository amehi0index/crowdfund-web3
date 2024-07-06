import React, { useState, useEffect } from 'react'
import { useStateContext } from '../context'
import { DisplayCampaigns } from '../components'


const Home = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [campaigns, setCampaigns] = useState([])
    const { contract, useGetCampaigns } = useStateContext()
    const { campaigns: parsedCampaigns, isLoading: campaignsLoading } = useGetCampaigns(contract)

    useEffect(() => {
      setIsLoading(campaignsLoading)
      // Update campaigns state only when parsedCampaigns change
      if (parsedCampaigns.length > 0) {
        console.log(parsedCampaigns)
        setCampaigns(parsedCampaigns)
      }
    }, [parsedCampaigns, campaignsLoading])

    return (
      <DisplayCampaigns
        title="All Campaigns"
        isLoading={isLoading}
        campaigns={campaigns} 
      />
    )
}

export default Home