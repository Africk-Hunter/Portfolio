/**
 * @type {import('gatsby').GatsbyConfig}
 */
module.exports = {
  siteMetadata: {
    title: `Hunter Africk`,
    description: 'Hunter Africk is a web developer and designer. Browse his projects, music and contact info.',
    siteUrl: `https://www.hunterafrick.com`
  },
  plugins: [
    "gatsby-plugin-sass",
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: 'Hunter Africk',
        short_name: 'Hunter Africk',
        start_url: '/',
        background_color: '#F2EFDF',
        theme_color: '#F2EFDF',
        display: 'minimal-ui',
        icon: 'src/images/icon.png',
      },
    },
  ],
};
