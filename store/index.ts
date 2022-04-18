import { ActionTree, MutationTree } from 'vuex';

/**
 * State
 */
export const state = () => ({
    isGoogleMapsScriptAppended: false,
    isGoogleMapsLoaded: false,
});

export type IndexState = ReturnType<typeof state>;

/**
 * Mutations
 */
export enum MutationTypes {
    SET_GOOGLE_MAPS_API_LOADED = 'SET_GOOGLE_MAPS_API_LOADED',
    SET_GOOGLE_MAPS_SCRIPT_APPENDED = 'SET_GOOGLE_MAPS_SCRIPT_APPENDED',
}

export const mutations: MutationTree<IndexState> = {
    [MutationTypes.SET_GOOGLE_MAPS_SCRIPT_APPENDED](state) {
        state.isGoogleMapsScriptAppended = true;
    },
    [MutationTypes.SET_GOOGLE_MAPS_API_LOADED](state) {
        state.isGoogleMapsLoaded = true;
    },
};

/**
 * Actions
 */
export enum ActionTypes {
    LOAD_GOOGLE_MAPS = 'LOAD_GOOGLE_MAPS',
}

export const actions: ActionTree<IndexState, IndexState> = {
    [ActionTypes.LOAD_GOOGLE_MAPS]({ commit, state }) {
        const shouldAppend = !state.isGoogleMapsScriptAppended;

        if (shouldAppend && window && document) {
            (window as any).appLoadGoogleMaps = () => {
                commit(MutationTypes.SET_GOOGLE_MAPS_API_LOADED);
            };
            const script = document.createElement('script');
            script.async = true;
            script.defer = true;
            script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAjflnF-9MmZlzquv0432izGsQ9l0a0jh8&libraries=places&callback=appLoadGoogleMaps`;
            // document.querySelector('head')?.appendChild(script);

            commit(MutationTypes.SET_GOOGLE_MAPS_SCRIPT_APPENDED);
        }
    },
};
