export default {
  data: () => ({
    sticky: {
      targetId: null,
      className: null,
      startHeight: 0,
    },
  }),
  mounted() {
    window.addEventListener('scroll', this.updateScroll);
  },
  destroyed() {
    window.removeEventListener('scroll', this.updateScroll);
  },
  methods: {
    /**
     * 스크롤 시 Side Bar Fixed 적용
     */
    updateScroll() {
      const SIDE_BAR_DIV = document.getElementById(this.sticky.targetId);
      if (!SIDE_BAR_DIV) return;

      if (SIDE_BAR_DIV.getBoundingClientRect()) {
        const sideBarScroll = SIDE_BAR_DIV.getBoundingClientRect().top;

        if (sideBarScroll <= this.sticky.startHeight) {
          SIDE_BAR_DIV.classList.add(this.sticky.className);
        } else {
          SIDE_BAR_DIV.classList.remove(this.sticky.className);
        }
      }
    },
  },
};
