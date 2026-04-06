import axiosClient from './axiosClient';

export interface User {
    id: number;
    username: string;
    rankTier?: string;
    actionPoints?: number;
}

const authApi = {
    enterVault: (username: string, passcode: string): Promise<User> => {
        return axiosClient.post('/auth/enter', { username, passcode });
    }
};

export default authApi;