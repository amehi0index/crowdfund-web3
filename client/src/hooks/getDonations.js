import { useReadContract } from 'thirdweb/react'
import { useEffect, useState } from 'react'
import { ethers } from 'ethers'

const useGetDonations = (contract, pId) => {
  const { data, isLoading, error } = useReadContract({
    contract,
    method: 'getDonators',
    params: [pId],
  })

  const [parsedDonations, setParsedDonations] = useState([])

  useEffect(() => {
    if (data && Array.isArray(data) && data.length === 2) {
      const numberOfDonations = data[0].length
      const donations = []

      for (let i = 0; i < numberOfDonations; i++) {
        donations.push({
          donator: data[0][i],
          donation: ethers.utils.formatEther(data[1][i].toString()),
        })
      }

      setParsedDonations(donations)
    }
  }, [data])

  return { donations: parsedDonations, isLoading, error }
}

export default useGetDonations