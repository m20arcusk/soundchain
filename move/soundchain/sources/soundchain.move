/*
/// Module: soundchain
module soundchain::soundchain;
*/
module soundchain::soudchain {
    
    // shared artist object
    public struct Artist has key {
        id: UID,
        owner: address,
        name: vector<u8>,
        tracks: vector<Track>,
    }
    
    // represents a track/unfinished clip an artist can upload
    public struct Track has key, store {
        id: UID,
        artist: address,
        song_title: vector<u8>,
        funding_goal: u64,
        current_funding: u64,
        finished: bool,
        investments: vector<Investment>,
    }

    // investment from buyer
    public struct Investment has store {
        investor: address,
        amount: u64,
    }

    // make new artist
    public fun create_artist(name: vector<u8>, ctx: &mut TxContext): address {
        let artist = Artist {
            id: object::new(ctx),
            owner: ctx.sender(),
            name: name,
            tracks: vector::empty<Track>(),
        };
        transfer::share_object(artist);
        ctx.sender() // return the artist's address
    }

    // create track
    public fun create_track(
        artist: &mut Artist, 
        funding_goal: u64, 
        song_title: vector<u8>,
        ctx: &mut TxContext
    ) {
        assert!(artist.owner == ctx.sender(), 0); // only the artist can create a track.
        
        let track = Track {
            id: object::new(ctx),
            artist: artist.owner,
            song_title: song_title,
            funding_goal: funding_goal,
            current_funding: 0,
            finished: false,
            investments: vector::empty<Investment>(),
        };
        vector::push_back(&mut artist.tracks, track);
    }

    /// Allow investors to fund a track.
    public entry fun invest(track: &mut Track, amount: u64, ctx: &mut TxContext) {
        assert!(!track.finished, 1); // Ensure track is not finished.
        track.current_funding = track.current_funding + amount;
        vector::push_back(&mut track.investments, Investment { investor: ctx.sender(), amount: amount });
        
        if (track.current_funding >= track.funding_goal) {
            track.finished = true;
            // add more logic for rewarding investors can be added here.
        }
    }
}