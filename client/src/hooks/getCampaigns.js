import { useReadContract } from 'thirdweb/react'
import { useEffect, useState } from 'react'
import { ethers } from 'ethers'

const useGetCampaigns = (contract) => {
    const { data, isLoading, error } = useReadContract({
        contract,
        method: "getCampaigns",
        params: []
    })

    const [parsedCampaigns, setParsedCampaigns] = useState([])

    useEffect(() => {
        if (data && Array.isArray(data)) {
            const parsed = data.map((campaign, i) => {
                // Convert deadline to milliseconds
                const deadlineInMs = ethers.BigNumber.isBigNumber(campaign.deadline)
                    ? campaign.deadline.toNumber() * 1000 // Convert to milliseconds
                    : Number(campaign.deadline) * 1000; // Ensure it's in milliseconds

                return {
                    owner: campaign.owner,
                    category: campaign.category,
                    title: campaign.title,
                    description: campaign.description,
                    target: ethers.utils.formatEther(campaign.target.toString()),
                    deadline: deadlineInMs,
                    amountCollected: ethers.utils.formatEther(campaign.amountCollected.toString()),
                    image: campaign.image,
                    pId: i
                };
            })

            setParsedCampaigns(parsed)
        }
    }, [data])

    return { campaigns: parsedCampaigns, isLoading, error }
}

export default useGetCampaigns