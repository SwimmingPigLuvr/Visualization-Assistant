/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      fontFamily: {
       'fira-regular': ['Fira-Regular', 'monospace'],
       'fira-bold': ['Fira-Bold', 'monospace'],
       'fira-light': ['Fira-Light', 'monospace'],
       'fira-medium': ['Fira-Medium', 'monospace'],
       'fira-retina': ['Fira-Retina', 'monospace'],
       'fira-semi-bold': ['Fira-SemiBold', 'monospace'],
       'fira-vf': ['Fira-VF', 'monospace'],
      }
    },
  },
  plugins: [],
}

