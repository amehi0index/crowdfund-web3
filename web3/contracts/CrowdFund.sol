pragma solidity ^0.8.0;

contract CrowdFund {
    // Struct to hold campaign details
    struct Campaign {
        address owner;
        string category;
        string title;
        string description;
        uint256 target;
        uint256 deadline;
        uint256 amountCollected;
        string image;
        address[] donators;
        uint256[] donations;
    }

    // Mapping to store campaigns by their unique ID
    mapping(uint256 => Campaign) public campaigns;

    // Counter to keep track of the number of campaigns created
    uint256 public numberOfCampaigns = 0;

    // Function to create a new campaign
    // Params: _owner, _title, _category,  _description, _target, _deadline, _image
    // Returns: New campaign ID
    function createCampaign(address _owner, string memory _category, string memory _title, string memory _description, uint256 _target, uint256 _deadline, string memory _image) public returns (uint256) {
        // Create a reference to the campaign using storage
        Campaign storage campaign = campaigns[numberOfCampaigns];

        // Require that the deadline is in the future
        require(_deadline > block.timestamp, "The deadline should be a date in the future");

        // Assign values to the campaign struct
        campaign.owner = _owner;
        campaign.category= _category;
        campaign.title = _title;
        campaign.description = _description;
        campaign.target = _target;
        campaign.deadline = _deadline;
        campaign.amountCollected = 0;
        campaign.image = _image;

        // Increment the number of campaigns and get the current campaign ID
        numberOfCampaigns++;

        // Return the ID of the newly created campaign
        return numberOfCampaigns - 1;
    }

   function donateToCampaign(uint256 _id) public payable {
        // Retrieve transaction amt
        uint256 amount = msg.value;

        // Retrieve the campaign from storage using the provided _id
        Campaign storage campaign = campaigns[_id];

        campaign.donators.push(msg.sender);

        campaign.donations.push(amount);

        // Attempt to transfer the donation to campaign owner
        (bool sent, ) = payable(campaign.owner).call{value: amount}("");

        // If successful, updateamount collected forcampaign
        if (sent) {
            campaign.amountCollected += amount;
        }
    }

    function getDonators(uint256 _id) view public returns (address[] memory, uint256[] memory){

         return (campaigns[_id].donators, campaigns[_id].donations);

    }

    function getCampaigns() public view returns (Campaign[] memory) {

        //Initialize a new dynamic array allCampaigns with a length equal to numberOfCampaigns. This array will store all campaigns retrieved from the campaigns mapping.
        Campaign[] memory allCampaigns = new Campaign[](numberOfCampaigns);

        for (uint i = 0; i < numberOfCampaigns; i++) {
            // Retrieve each campaign from storage and store in local variable
            Campaign storage item = campaigns[i];

            //Populate array with items
            allCampaigns[i] = item;
        }

        return allCampaigns;

    }
}