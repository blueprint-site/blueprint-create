                                
## How do we manage the data ? 

    We use a combination of techno to achieve an optimizied real-time management of our
    data over all the client
    
    The main files used to achieved that are : 

        - src/hooks/useData.ts                  -> contain the entity manager 
        - src/components/utility/Supabase.tsx   -> contain the supabase client & function
        - src/hooks/supabaseListener.ts         -> contain the function to listen change

### How that's work ? 

    Step one : At the start of the app 
    
        At the start of the app we exexute useSupabaseListener(); in the App.tsx file
        to connect the client to the websocket of supabase real-time events to keep all
        the data up to date with the change made by anyone
    
    Step two : When there is a request done client side 
        
        When the user navigate around in the app he gonna make request trought the entity
        manager how let us make any request on the supabase tables with caching. we use 
        @tanstack/react-query  to manage these request and the cache time of the data.
        then normaly for most of the request we have 1 hour cache enable by default,
        why so much ? because the realtime function we have launch at the step 1 counter
        this high cache time 

    Step Three : All keep it'self up to date

        No Harry! you are not a wizzard ! At the moments the request is send in the entity
        manager you don't have to worried about is lifetime , the entity manager and the 
        supabase listener gonna take care of keeping all the information up-to date !
        if a change have been made on any of the table listed in supabaseListener.tsx
        a websoket event is send to all the client connected and the value of the data
        is updated.


### Exemple of usage 
          
        In this exemple we load a page of 1000 addon 

        const { data: addons, isLoading, error } = useEntityManager<Addon>("mods", AddonSchema, {
            pageSize: 1000,
        });
        
        the first props is the name of the table where you want to make the request

        you can see that in the request i give a AddonSchema in the props they are zod schema and need to be created in 
        /src/schemas/nameOfTheType.schema.tsx 

        the third props is the filter you want to apply at the request


