import { NextApiRequest, NextApiResponse } from 'next';
import { getManagementApiToken } from '../auth0';
// pages/api/create-user.js

interface UserRequestBody {
    email: string;
    password: string;
    connection: string;
}
 
export default async function POST(request: NextApiRequest) 
{   
    //const auth0 = params.auth0;
    
    const {email, password, connection} = request.body as UserRequestBody;

    try {
        const ISSUER_BASEURL = process.env.AUTH0_ISSUER_BASE_URL;
        const token = await getManagementApiToken();
        
        const userData = {
            email,
            password,
            connection,

            
        };

        const response = await fetch(`${ISSUER_BASEURL}api/v2/users}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(userData) // Data from the client to create the user
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to create user');
        }

        return Response.json({
            status:200,
            data: data
        })
        

    } catch (error) {
        console.error('Error parsing Request:', error);
        return Response.json({
          error: "Invalid Request",
          status: 400 
        });
      }

    
    

    
    
    /* if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const token = await getManagementApiToken(); // Function to get an Auth0 token
        const response = await fetch('https://your-domain.auth0.com/api/v2/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(req.body) // Data from the client to create the user
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to create user');
        }

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    } */
}


