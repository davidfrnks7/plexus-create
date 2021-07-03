/* eslint-disable @typescript-eslint/no-unused-vars */
// import { Base } from './Base';
import { Field, Int, ObjectType } from "type-graphql";
import { Column, OneToMany, OneToOne, JoinColumn, Entity, JoinTable, ManyToMany } from "typeorm";

import { Base } from "./Base";
// import { FollowProject } from "./FollowProject";
// import { FollowUser } from "./FollowUser";
import { Users } from "./nextauth/Users";
import { Project } from "./Project";

@ObjectType()
@Entity()
export class Profile extends Base {
  @Field(() => Int)
  @OneToOne(() => Users, (user) => user.id)
  @JoinColumn({ name: "user_id", referencedColumnName: "id" })
  user_id: number;

  @Field(() => String)
  @Column({})
  name!: string;

  @Field(() => String)
  @Column({ unique: true })
  username!: string;

  @Field(() => String)
  @OneToOne(() => Users, (user) => user.email)
  @JoinColumn({ name: "email", referencedColumnName: "email" })
  email: string;

  // No Field Decorator here means the password is only accessible on database not accessible in graphql
  @Column({ nullable: true })
  password: string;

  @Field(() => String)
  @Column({
    type: "text",
    nullable: true,
  })
  image: string;

  @Field(() => String)
  @Column({
    nullable: true,
  })
  title: string;

  @Field(() => String)
  @Column({
    type: "text",
    nullable: true,
  })
  bio: string;

  @Field(() => String)
  @Column({
    type: "text",
    nullable: true,
  })
  website: string;


  @Field(() => [Project])
  @OneToMany(() => Project, (p: Project) => p.owner)
  projects: Project[];

  //* self referencing many to many table for creating follow relationship
  @ManyToMany(() => Profile, user => user.following)
  @JoinTable()
  followers: Profile[];

  @ManyToMany(() => Profile, user => user.followers)
  following: Profile[];

  @ManyToMany(() => Project)
  @JoinTable()
  followedProjects: Project[];

  // //* FollowProject m to m relationship
  // @OneToMany(() => FollowProject, (followProject: any) => followProject.profile)
  // followProject: Promise<FollowProject[]>


  // //* FollowUser m to m self referential 
  // @OneToMany(() => FollowUser, (followUser: any) => followUser.follower)
  // follows: Promise<FollowUser[]>

  // @OneToMany(() => FollowUser, (followUser: any) => followUser.followed)
  // followers: Promise<FollowUser[]>
}
