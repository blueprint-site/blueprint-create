import "../../styles/userpage.scss";
import { useParams } from "react-router-dom";
import supabase from "../../components/Supabase";

const UserPage = () => {
    const { username } = useParams();

    const handleFetchUserData = async () => {
        const { data, error } = await supabase
            .from('auth')
            .select('*')
            .eq('display_name', { username });

        if (error) {
            console.error('Error fetching user data:', error);
            return;
        }

        console.log('User data:', data);
        // Use the user data as needed
    };

    return (
        <>
            <h1>{username}</h1>
            <button onClick={handleFetchUserData}>Handle data</button>
        </>
    );
}

export default UserPage;