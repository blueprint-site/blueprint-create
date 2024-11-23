import React, { useState, useEffect } from 'react';
import Collections from './CollectionHandler';
import Badge from 'react-bootstrap/Badge';

import "../styles/collections.scss";

const CollectionComponent: React.FC = () => {
    const [collection, setCollection] = useState<string[]>([]);
    const [isListVisible, setIsListVisible] = useState<boolean>(false); // State to track visibility

    // Load the collection when the component mounts
    useEffect(() => {
        const initialCollection = Collections.getCollection();
        console.log("Initial Collection Loaded:", initialCollection); // Debugging log
        setCollection(initialCollection);
    }, []);

    // Function to add an item to the collection
    const handleAddAddon = (addonSlug: string) => {
        Collections.collectionAdded(addonSlug);
        const updatedCollection = Collections.getCollection(); // Get the updated collection
        console.log("Updated Collection After Adding:", updatedCollection); // Debugging log
        setCollection(updatedCollection); // Update state after adding
    };

    // Function to remove an item from the collection
    const handleRemoveAddon = (addonSlug: string) => {
        Collections.removeAddon(addonSlug);
        const updatedCollection = Collections.getCollection(); // Get the updated collection
        console.log("Updated Collection After Removing:", updatedCollection); // Debugging log
        setCollection(updatedCollection); // Update state after removing
    };

    // Toggle visibility of the list
    const toggleListVisibility = () => {
        setIsListVisible((prev) => !prev);
    };

    const downloadAddons = () => {
        collection.forEach((addon, index) => {
            const url = `https://modrinth.com/mod/${addon}`;
            setTimeout(() => {
                window.open(url, '_blank');
            }, index * 100); // Delay each open by 100 milliseconds
        });
    };
    return (
        <div className='collection'>
            <div className="titlebox">
                <h3 className='collection-title'>
                    Your Addon Collection (<a href="https://telegra.ph/What-r-collections-10-15">what</a>) <span className="badge">New</span>
                    <h6 className='smol-text'>Refresh the page to see changes. Click on each addon to remove it</h6>
                </h3>
            </div>

            <button className='toggle' onClick={toggleListVisibility}>
                {isListVisible ? 'Hide Collection' : 'Show Collection'}
            </button>
            <button className='download-small' onClick={downloadAddons}>
                Download All (May not work)
            </button>

            {isListVisible && ( // Conditionally render the list
                <ul>
                    {collection.length > 0 ? (
                        collection.map((addon, index) => (
                            <li className='list-items' key={index} onClick={() => handleRemoveAddon(addon)}>
                                {addon}
                                <button className='download' onClick={(event) => {
                                    event.stopPropagation(); // Prevents the click from bubbling up to the <li>
                                    window.open(`https://modrinth.com/mod/${addon}`, '_blank'); // Opens the addon URL
                                }}>
                                    Open
                                </button>
                            </li>

                        ))
                    ) : (
                        <li className='list-items'>No addons in collection :( , add some below</li> // Message if the collection is empty
                    )}
                </ul>
            )}
        </div>
    );
};

export default CollectionComponent;
