<template>
    <div class="root input">
        <label class="g-pb-2" :class="{ 'g-sr-only': hideLabel }" :for="uniqueID">{{ label }}</label>
        <div class="input_row">
            <input
                v-bind="$attrs"
                :id="uniqueID"
                :value="value"
                :aria-describedby="'message-' + uniqueID"
                :type="inputType === 'search' ? 'text' : InputType"
                @input="updateValue"
                @keydown="inputKeydown"
            />
            <template v-if="inputType === 'search'">
                <button class="g-btn-1 input_btn" type="submit" @click="searchSubmit">
                    <span class="g-icon search"></span>
                </button>
            </template>
        </div>
        <div class="message" role="alert" v-show="message" :id="'message-' + uniqueID">
            <div :class="{ 'is-error': !isValid }">{{ message }}</div>
        </div>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import { v4 as uuidv4 } from 'uuid';

    export enum TypeEnum {
        Text = 'text',
        Search = 'search',
    }
    export enum EmitEvents {
        Input = 'input',
        SearchSubmit = 'search-submit',
    }

    export default Vue.extend({
        name: 'BaseInput',
        props: {
            value: {
                type: [String, Number],
                default: '',
            },
            inputType: {
                type: String as () => TypeEnum,
                default: TypeEnum.Text,
                required: true,
            },
            label: {
                type: String,
                default: '',
                required: true,
            },
            hideLabel: {
                type: Boolean,
                default: false,
            },
            isValid: {
                type: Boolean,
                default: true,
            },
            message: {
                type: String,
                default: '',
            },
            showStatus: {
                type: Boolean,
                default: false,
            },
        },
        data() {
            return {
                uniqueID: '',
            };
        },
        computed: {
            compSlots(): any {
                return { ...this.$slots };
            },
        },
        beforeMount() {
            this.uniqueID = uuidv4();
        },
        methods: {
            updateValue(event: any) {
                this.$emit('input', event.target.value);
            },
            inputKeydown(event: any) {
                const getKey = event.key.toLowerCase();
                const isEnterKey = getKey === 'enter';

                if (this.inputType === TypeEnum.Search && isEnterKey) {
                    this.searchSubmit();
                }
            },
            searchSubmit() {
                this.$emit(EmitEvents.SearchSubmit);
            },
        },
    });
</script>

<style lang="scss" scoped>
    .input_row {
        display: flex;
        align-items: stretch;
        gap: 10px;
        flex-wrap: wrap;
    }
    label {
        display: inline-block;
        font-size: 0.9em;
        font-style: italic;
    }
    input {
        padding: 10px;
        flex-grow: 1;
    }
    /* search button */
    .input_btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 50px;

        .g-icon {
            font-size: 1em;
        }
    }
    /* error message */
    .is-error {
        color: var(--th-alert-text);
    }
</style>
