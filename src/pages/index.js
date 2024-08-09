import * as React from "react"
import { Link, graphql } from "gatsby"
import Utterances from "../components/Utterances"
import RecentPostBox from "../components/recentpost"
import Layout from "../components/layout"
import Seo from "../components/seo"
import CategoryList from "../components/categorylist"
import styled from "styled-components"

// 스타일
const ArticleBox = styled.article`
  background: #fefae0;
  border-radius: 15px;
  padding: 1rem;
  height: 14rem;
  transition: box-shadow 0.3s ease-in-out;
  box-shadow: none;
  &:hover {
    box-shadow: 0 5px 8px rgb(82 82 82 / 74%);
  }
  & > header {
    height: 5rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
  }
`
const ArticleMain = styled.ol`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 10px;
  list-style: none;
  padding: 0;
`
const ArticleTitle = styled.p`
  margin: 0 0 0.5rem;
  font-weight: 600;
  & > a {
    text-decoration: none;
    font-size: 1.1rem;
    color: #333333;
  }
`
const BlogIndex = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const posts = data.allMarkdownRemark.nodes
  const [selectedCategory, setSelectedCategory] = React.useState("")

  const filteredPosts = selectedCategory
    ? posts.filter(post => post.frontmatter.category === selectedCategory)
    : posts

  if (posts.length === 0) {
    return (
      <Layout location={location} title={siteTitle}>
        <p>"gatsby-source-filesystem" 플러그인이 포스트를 찾지 못했습니다!</p>
        {/* (or the directory you specified for the "gatsby-source-filesystem" plugin in gatsby-config.js).  */}
      </Layout>
    )
  }
  return (
    <Layout location={location} title={siteTitle}>
      <CategoryList data={posts} onCategorySelect={setSelectedCategory} />
      <RecentPostBox />
      <ArticleMain style={{ listStyle: `none` }}>
        {filteredPosts.map(post => {
          const title = post.frontmatter.title || post.fields.slug
          let shortenedTitle =
            title.length > 20 ? title.substring(0, 20) + "..." : title
          const description = post.frontmatter.description || post.excerpt
          const shortenedDescription =
            description.length > 100
              ? description.substring(0, 50) + "..."
              : description

          return (
            <li key={post.fields.slug}>
              <ArticleBox
                className="post-list-item"
                itemScope
                itemType="http://schema.org/Article"
              >
                <header>
                  <ArticleTitle>
                    <Link to={post.fields.slug} itemProp="url">
                      <span itemProp="headline">{shortenedTitle}</span>
                    </Link>
                  </ArticleTitle>
                  <small>{post.frontmatter.date}</small>
                </header>
                <section>
                  <p
                    dangerouslySetInnerHTML={{
                      __html: shortenedDescription,
                    }}
                    itemProp="description"
                  />
                </section>
              </ArticleBox>
            </li>
          )
        })}
      </ArticleMain>
      <Utterances />
    </Layout>
  )
}

export default BlogIndex

/**
 * Head export to define metadata for the page
 *
 * See: https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-head/
 */
export const Head = () => <Seo title="All posts" />

export const pageQuery = graphql`
  {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { frontmatter: { date: DESC } }) {
      nodes {
        excerpt
        fields {
          slug
        }
        frontmatter {
          date(formatString: "MMMM DD, YYYY")
          title
          description
          category
        }
      }
    }
  }
`
