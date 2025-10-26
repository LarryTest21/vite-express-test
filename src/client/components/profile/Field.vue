<script setup lang="ts">
import { defineProps, defineEmits, ref, computed, watch } from "vue";
import Eye from '../icons/eye.vue'
const props = defineProps({
    icon: Object,
    label: String,
    modelValue: [String, Number],
    editing: Boolean,
    skeleton: Boolean,
    invalidFields: Array
});
const showPassword = ref(false);

const emit = defineEmits(["update:modelValue"]);

const inputType = computed(() => {
    if (props.label === 'New Password') return showPassword.value ? 'text' : 'password';
    return 'text';
});
function toggleShowPassword() {
    showPassword.value = !showPassword.value;
}

const isInvalid = computed(() => props.invalidFields?.includes(props.label));

const transitionKey = computed(() => {
    if (props.skeleton) return 'skeleton';
    if (!props.editing) return 'value';
    return 'input';
});
</script>
<template>
    <div class="field" :class="{ invalid: isInvalid }">
        <div class="label-input">
            <div class="icon-label">
                <component :is="icon" class="icon-svg" />
                <label>{{ label }}</label>
            </div>

            <!-- ✅ Wrap all conditional blocks in a single root element for transition -->
            <transition name="editing" mode="out-in" class="container">
                <div :key="transitionKey">
                    <div v-if="skeleton" class="skeleton" />
                    <div v-else-if="!editing" class="value">
                        {{ modelValue }}
                    </div>
                    <div v-else class="input-wrapper">
                        <div class="input-inner">
                            <input :type="inputType" :value="modelValue" class="input"
                                :class="props.label === 'New Password' ? 'password' : ''"
                                @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value, props.label)" />
                            <button v-if="props.label === 'New Password'" type="button" class="toggle-password"
                                @click="toggleShowPassword" @mousedown.prevent :aria-pressed="showPassword"
                                :title="showPassword ? 'Hide password' : 'Show password'">
                                <Eye class="toggle-password-icon" />
                            </button>
                            <span class="underline" v-if="props.label !== 'New Password'"></span>
                        </div>
                    </div>
                </div>
            </transition>
        </div>
    </div>
</template>


<style lang="scss" scoped>
.field {
    position: relative;
    display: flex;
    align-items: center;
    margin-bottom: 10px;

    .label-input {
        position: relative;
        font-size: 1.3rem;
        font-weight: 600;

        .icon-label {
            display: flex;
            align-items: center;

            .icon-svg {
                width: 40px;
                fill: var(--color-nav-txt-darker);
            }
        }


        .skeleton {
            width: 230px;
            height: 23px;
            border-radius: 4px;
            background: linear-gradient(90deg,
                    var(--color-skeleton, #ccc) 25%,
                    var(--color-skeleton-accent, #ddd) 50%,
                    var(--color-skeleton, #ccc) 75%);
            background-size: 200% 100%;
            animation: shimmer 1.2s infinite linear;
        }

        .value {
            font-family: Roboto Condensed;
            font-size: 1.2rem;
            height: 23px;
            display: flex;
            align-items: center;
            margin-left: 40px;
        }

        /* 🔹 no positioning here anymore */
        .input-wrapper {
            display: flex;
            align-items: center;
            width: 100%;
            height: 23px;
            margin-left: 40px;

        }

        /* inner handles underline positioning */
        .input-inner {
            position: relative;
            z-index: 0;
            left: -12px;
            top: -3px;

            &::after {
                content: "";
                display: flex;
                position: absolute;
                top:0;
                border-radius: 4px;
                height: 100%;
                width: 100%;
                background-color: transparent;
                z-index: -1;
                pointer-events: none;
            }

            .input {
                height: 22px;
                color: var(--color-nav-txt);
                font-family: 'Roboto Condensed', sans-serif;
                font-size: 1.2rem;
                font-weight: 600;
                background: transparent;
                border: none;
                outline: none;
                z-index: 2;
                padding: 12px;

                &.password {
                    height: 30px;
                    border: 3px solid var(--color-nav-txt);
                    border-radius: 5px;
                    padding: 0 10px 0 10px;

                }
            }
        }


        .underline {
            position: absolute;
            left: 0;
            bottom: 0;
            width: 100%;
            height: 2px;
            background-color: #ccc;
            overflow: hidden;

        }

        .underline::after {
            content: "";
            position: absolute;
            left: 0;
            top: 0;
            height: 100%;
            width: 0%;
            background-color: var(--color-nav-txt);
            transition: width 0.3s ease;
        }

        .input:focus+.underline::after {
            width: 100%;
        }

        .toggle-password {
            position: absolute;
            right: 6px;
            top: 50%;
            transform: translateY(-50%);
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border: none;
            background: transparent;
            cursor: pointer;
            padding: 0;
            line-height: 0;
            border-radius: 4px;
            z-index: 4;

            .toggle-password:focus {
                outline: 2px solid rgba(0, 0, 0, 0.12);
                outline-offset: 2px;
            }

            /* small icon sizing */
            .toggle-password-icon {
                width: 50px;
                height: 50px;
            }

            /* optionally change icon color when visible */
            .toggle-password[aria-pressed="true"] .toggle-password-icon {
                opacity: 0.85;
            }

            .toggle-password-iconb {
                cursor: pointer;
            }

            svg :deep(.eye-1, .eye-2) {
                transition: all 0.2s ease-in-out;
            }

            svg :deep(.eye-1) {
                fill: var(--color-nav-bg);
            }

            svg :deep(.eye-2) {
                fill: var(--color-nav-txt);
            }
        }



    }

}

.field.invalid .input {

    border: 2px solid #e74c3c;
    animation: border-color 2s infinite
}

.field.invalid {
    .label-input {
        .container {
            .input {
                color: var(--color-nav-bg);
                animation: text-color 2s infinite
            }

            .input-inner::after {
                background-color: rgb(204, 3, 3);
                animation: background 2s infinite;
            }


        }
    }

}

/* optional shake animation */
.field.invalid .input:focus {
    animation: shake 0.2s ease-in-out;
}

@keyframes shake {

    0%,
    100% {
        transform: translateX(0);
    }

    25% {
        transform: translateX(-2px);
    }

    75% {
        transform: translateX(2px);
    }
}

@keyframes background {

    0% {
        opacity: 0;

    }

    50% {
        opacity: 1;
    }

    100% {
        opacity: 0;

    }

}

@keyframes text-color {

    0% {
        color: var(--color-nav-txt);
    }

    30% {
        color: var(--color-nav-bg);
    }

    100% {
        color: var(--color-nav-txt);

    }

}


/* ✅ Transition group animations preserved */
.editin-move,
.editing-enter-active,
.editing-leave-active {
    transition: opacity 0.3s ease, transform 0.3s ease;

}

.editing-enter-from,
.editing-leave-to {
    opacity: 0;
    transform: translateY(10px);

}

.editing-enter-to,
.editing-leave-from {
    opacity: 1;
    transform: translateY(0);
}

/* 👇 Only leaving element is absolutely positioned, so layout stays steady */
.editing-leave-active {}

@keyframes shimmer {
    0% {
        background-position: 200% 0;
    }

    100% {
        background-position: -200% 0;
    }
}
</style>
