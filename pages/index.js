import React, { useState } from "react";

import { Tabs, TabList, Tab } from "@chakra-ui/react";
import {
  Menu,
  MenuButton,
  MenuList,
  Button,
  MenuOptionGroup,
  MenuItemOption,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { useMediaQuery } from "@react-hook/media-query";
import { useWindowSize } from "../components/Hooks/useWindowSize";
import { FixedSizeList } from "react-window";
import GitHubIcon from "@material-ui/icons/GitHub";
import EmailIcon from "@material-ui/icons/Email";
import InstagramIcon from "@material-ui/icons/Instagram";
import { ENDPOINTS } from "../Consts";

import User from "../components/User/User";
import styles from "../styles/Home.module.css";
export default function Home({ data, last_updated }) {
  const [type, setType] = useState(0);
  const matches = useMediaQuery("only screen and (max-width: 800px)");
  const size = useWindowSize();
  const [selected, setSelected] = React.useState("Any");
  const data_ = [
    "Any",
    "Colombo",
    "Kandy",
    "Gampaha",
    "Galle",
    "Jaffna",
    "Matara",
  ];
  type == 1
    ? data.sort(function (a, b) {
        return b.followers - a.followers;
      })
    : type == 0
    ? data.sort(function (a, b) {
        return (
          b.private_contributions +
          b.public_contributions -
          (a.private_contributions + a.public_contributions)
        );
      })
    : 0;

  console.log(selected);

  selected !== "Any"
    ? (data = data.filter(function (el) {
        return el.location.split(",")[0] == selected;
      }))
    : 0;
  function renderRow() {
    return (
      <>
        {data.map((data, index) => {
          return <User rank={index + 1} data={data} key={data.login} />;
        })}
      </>
    );
  }

  const handleChange = React.useCallback((value) => {
    setSelected(value);
  });
  return (
    <div className={styles.container}>
      <div className={styles.info}>
        <div className={styles.info_top}>
          <div className={styles.logo}>
            <span className={styles.sl_part}>sl</span>GithubStats
          </div>
          <p>
            top 200 most active Github users in Sri Lanka
            <img width="20px" height="20px" src={`/sl.png`} />
          </p>
          <span className={styles.updated}>Last updated : {last_updated}</span>
        </div>
        <div className={styles.info_bottom}>
          <span className={styles.by}>Developed by Dulaj Kavinda</span>
          <div className={styles.contact}>
            <div>
              <GitHubIcon />
            </div>
            <div>
              <InstagramIcon />
            </div>
            <div>
              <EmailIcon />
            </div>
          </div>

          <span className={styles.using}>
            Repo :
            <a href="https://github.com/dulajkavinda/slgithub">
              https://github.com/dulajkavinda/slgithub
            </a>
          </span>
        </div>
      </div>
      <div className={styles.main}>
        <div className={styles.top_header}>
          <Tabs
            onChange={(index) => setType(index)}
            className={styles.tabs}
            variant="soft-rounded"
            colorScheme="blue"
          >
            <TabList>
              <Tab>
                <span className={styles.tab}>Contributions</span>
              </Tab>
              <Tab>
                <span className={styles.tab}>Followers</span>
              </Tab>
            </TabList>
          </Tabs>
          <Menu>
            <MenuButton
              className={styles.province_menu}
              as={Button}
              rightIcon={<ChevronDownIcon />}
            >
              Province
            </MenuButton>
            <MenuList>
              <MenuOptionGroup
                type="radio"
                value={selected}
                onChange={handleChange}
              >
                {data_.map((item, index) => (
                  <MenuItemOption
                    key={`menu-item-option-${index}`}
                    value={item}
                  >
                    {item}
                  </MenuItemOption>
                ))}
              </MenuOptionGroup>
            </MenuList>
          </Menu>
        </div>
        <div className={styles.coulmn_names}>
          <div className={styles.col_rank}>Rank</div>
          <div className={styles.col_user}>User</div>
          <div className={styles.col_contr}>
            {matches ? "Contr." : "Contribution"}
          </div>
          <div className={styles.col_fol} className={styles.col_fol}>
            {matches ? "Fol." : "Followers"}
          </div>
          <div className={styles.col_git}> {matches ? "Git." : "Github"}</div>
        </div>
        <FixedSizeList
          style={{
            margin: "0px",
            padding: "0px",
            overflow: "scroll",
          }}
          height={size.height * 0.75}
          width={"100%"}
          itemSize={20}
          itemCount={1}
        >
          {renderRow}
        </FixedSizeList>
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  const res = await fetch(ENDPOINTS.GET_CONTR);
  const data = await res.json();
  data[0].dataset.sort(function (a, b) {
    return (
      b.private_contributions +
      b.public_contributions -
      (a.private_contributions + a.public_contributions)
    );
  });

  if (!data) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      data: data[0].dataset.slice(0, 200),
      last_updated: data[0].modified,
    }, // will be passed to the page component as props
  };
}
