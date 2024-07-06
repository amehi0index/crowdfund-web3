import React, { useState, useEffect } from 'react'
import { DisplayCampaigns } from '../components'
import { useStateContext } from '../context'

const Profile = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [campaigns, setCampaigns] = useState([])
  
  const { contract, address, useGetCampaigns } = useStateContext()
  const { campaigns: parsedCampaigns, isLoading: campaignsLoading } = useGetCampaigns(contract)

  useEffect(() => {
    const fetchUserCampaigns = async () => {
      setIsLoading(true)

      if (parsedCampaigns.length > 0 && address) {
        const filteredCampaigns = parsedCampaigns.filter(campaign => campaign.owner === address)
        setCampaigns(filteredCampaigns)
        setIsLoading(false)
      }
    }

    fetchUserCampaigns()
  }, [parsedCampaigns, address]) // Re-fetch campaigns when parsedCampaigns or address changes

  return (
    <DisplayCampaigns
      title="My Campaigns"
      isLoading={isLoading}
      campaigns={campaigns}
    />
  )
}

export default Profile