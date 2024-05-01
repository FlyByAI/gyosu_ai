import toast from "react-hot-toast";

const fetchInterceptor = async (input: RequestInfo, init?: RequestInit): Promise<Response> => {
    const response = await fetch(input, init);
  
    if (response.status === 401) {
      toast("Please sign in to perform this action.");
      return Promise.reject(new Error("Unauthorized")); 
    }
  
    if (response.status === 429) {
      toast("Rate limit exceeded. Please try again later.");
      return Promise.reject(new Error("Too Many Requests")); 
    }
  
    return response;
  };

  export default fetchInterceptor;