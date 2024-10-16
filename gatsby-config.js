/**
 * @type {import('gatsby').GatsbyConfig}
 */
module.exports = {
  siteMetadata: {
    title: `Hunter Africk Portfolio`,
    description: 'My portfolio featuring web development projects, showcasing personal work and skills in coding and design.',
    siteUrl: `https://www.hunterafrick.com`
  },
  plugins: [
    "gatsby-plugin-sass",
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        icon: 'src/images/icon.png', 
      },
    },
  ],
};
