import React, { useState, useContext, createContext } from 'react'
import { createThirdwebClient, prepareContractCall, getContract } from 'thirdweb'
import { useSendTransaction, useConnect } from 'thirdweb/react'
import { createWallet, injectedProvider } from 'thirdweb/wallets'
import { sepolia } from 'thirdweb/chains'
import { ethers } from 'ethers'
import { abi } from '../utils/contractABI'
import useGetCampaigns from '../hooks/getCampaigns'
import useGetDonations from '../hooks/getDonations'


const StateContext = createContext()
const clientId =  import.meta.env.VITE_CLIENT_ID
const client = createThirdwebClient({ clientId })
export const StateContextProvider = ({ children }) => {
    const { connect, isConnecting, error } = useConnect()
    const [address, setAddress] = useState(null)
    const [isRequestPending, setIsRequestPending] = useState(false)

    const contract = getContract({
        client,
        chain: sepolia,
        address: import.meta.env.VITE_CONTRACT_ADDRESS,
        abi: abi
    })

    const connectWallet = async () => {
        if (isRequestPending) {
            console.warn("Request already pending. Please wait.")
            return
        }

        setIsRequestPending(true)

        try {
            await connect(async () => {
                const metamask = createWallet("io.metamask")

                if (injectedProvider("io.metamask")) {
                    await metamask.connect({ client })
                } else {
                    await metamask.connect({
                        client,
                        walletConnect: { showQrModal: true },
                    })
                }

                const account = await metamask.getAccount()
                console.log('account:', account.address)
                setAddress(account.address)

                return metamask
            })
        } catch (error) {
            console.error("Failed to connect wallet:", error)
        } finally {
            setIsRequestPending(false)
        }
    }

    const { mutate: createCampaign, data: transactionResult } = useSendTransaction()

    const publishCampaign = async (form) => {
        try {
            const transaction = prepareContractCall({
                contract,
                method: 'createCampaign',
                params: [
                    address, // owner
                    form.category,
                    form.title,
                    form.description,
                    ethers.utils.parseUnits(form.target.toString(), 'ether'),
                    // new Date(form.deadline).getTime(), // deadline,
                    Math.floor(new Date(form.deadline).getTime() / 1000), // Convert to Unix timestamp
                    form.image
                ]
            })

            console.log('Transaction:', transaction)
            createCampaign(transaction, {
                onSuccess: (data) => {
                    console.log('Contract Success: ', data)
                },
                onError: (error) => {
                    console.log('Contract Call Failed: ', error)
                }
            })
        } catch (error) {
            console.log('Contract Call Failed: ', error)
        }
    }

    // const { mutate: sendTransaction } = useSendTransaction()

    // const donate = async (pId, amount) => {
    //     try {
    //         const transaction = prepareContractCall({
    //             contract,
    //             method: "function donateToCampaign(uint256 _id) payable",
    //             params: [pId],
    //           })

    //           await sendTransaction(transaction).catch((err) => {
    //             setError(err)
    //           })
    //     } catch (error) {
    //         console.log('Contract Call Failed: ', error)
    //     }
    // }
    const { mutate: sendTransaction } = useSendTransaction()
    const donate = async (contract, pId, amount) => {
        try {
            if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
                throw new Error('Invalid amount. Please enter a valid number greater than zero.')
            }
            const transaction = prepareContractCall({
                contract,
                method: "donateToCampaign",
                params: [pId],
                value: ethers.utils.parseEther(amount),
            })
    
            console.log('Transaction:', transaction)
    
            sendTransaction(transaction, {
                onSuccess: (data) => {
                    console.log('Contract Success: ', data)
                },
                onError: (error) => {
                    console.log('Contract Call Failed: ', error)
                }
            })
    
        } catch (error) {
            console.error('Contract Call Failed: ', error)
        }
    }

    return (
        <StateContext.Provider
            value={{
                address,
                contract,
                connectWallet,
                createCampaign: publishCampaign,
                useGetCampaigns,
                useGetDonations,
                donate
            }}
        >
            {children}
        </StateContext.Provider>
    )
}

export const useStateContext = () => useContext(StateContext)

