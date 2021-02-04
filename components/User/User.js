import styles from "./User.module.css";

import React from "react";
import { Avatar } from "@chakra-ui/react";
import GitHubIcon from "@material-ui/icons/GitHub";
export default function Users({ data, rank }) {
  return (
    <div className={styles.user_info_tile_wrapper}>
      <div className={styles.user_info_tile}>
        <div className={styles.col_rank}>{rank}</div>
        <div className={styles.col_user}>
          <div>
            <Avatar name="Dan Abrahmov" src={data.avatar_url} />
          </div>
          <div className={styles.user_name}>
            {data.login}{" "}
            <div className={styles.user_name_bottom}> {data.name}</div>
          </div>
        </div>
        <div className={styles.col_contr}>
          {data.private_contributions + data.public_contributions}
        </div>
        <div className={styles.col_fol} className={styles.col_fol}>
          {data.followers}
        </div>
        <div
          className={styles.col_git}
          onClick={() =>
            window.open(`https://github.com/` + data.login, "_blank")
          }
        >
          <GitHubIcon />
        </div>
      </div>
    </div>
  );
}
