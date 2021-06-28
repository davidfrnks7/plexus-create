import React, { Fragment, useContext, useEffect, useRef } from 'react'
import {
  Box,
  Flex,
  Avatar,
  Link,
  Button,
  useColorModeValue,
  Icon,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  useColorMode
} from '@chakra-ui/react';
import { signOut, useSession } from 'next-auth/client'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from '@fortawesome/free-solid-svg-icons'
import { useGetUserQuery, useGetProfileUserIdQuery, useCreateProfileForUserMutation } from '../../generated/graphql';
import { withUrqlClient } from 'next-urql';
import { UserContext } from '../../context/userContext';

const UserLinks = ['Profile'];

const PopoverLink = (link: string): JSX.Element => (
  <Link
    key={link}
    px={2}
    py={1}
    rounded={'md'}
    _hover={{
      textDecoration: 'none',
      bg: useColorModeValue('orange.200', 'orange.700'),
    }}
    href={`/${link.toLowerCase()}`}
  >
    {link}
  </Link>
);

export const loggedOutIcon = (): JSX.Element => {
  return <FontAwesomeIcon icon={faUserCircle} size='3x' />
}

const NextAuth: React.FC<{}> = ({ }) => {
  // Next auth session
  const [session] = useSession();
  // User from next auth session
  const user = session ? session.user : { name: "", email: "", image: "" };

  // Grab props from user in the session or use empty strings
  const name = user?.name || "";
  const email = user?.email || "";
  const image = user?.image || "";

  // Color mode
  const { colorMode, toggleColorMode } = useColorMode();

  // Get users
  const [userResult] = useGetUserQuery({ variables: { name: name, email: email } });
  const { data: userData, fetching: userFetching, error: userError } = userResult;

  // User id from the queried user
  const userId = useRef(0)

// Get user's profile
  const [profileResult, refetch] = useGetProfileUserIdQuery({ variables: { user_id: userId.current } });
  const { data: profileData, fetching: profileFetching, error: profileError } = profileResult;

  // User profile
  const { userProfile, setUserProfile } = useContext(UserContext)

  // Create profile mutation
  const [, createProfile] = useCreateProfileForUserMutation();

  // Getting userId from database and setting it to a useRef
  useEffect(() => {
    if (session) {
      if (userFetching === false) {
        const user = userData?.findUser;
        if (user) {
          userId.current = Number(user.id);
          refetch();
        }
      }
    }
  }, [refetch, session, userData?.findUser, userFetching])

  // Getting user's profile from the database and setting it to context or creating a profile for them and re-fetching the profile with fresh data
  useEffect(() => {
    if (profileFetching === false && userId.current !== 0) {
      const profile = profileData?.findProfileUserId;
      if (profile) {
        // There is a bug with join tables in GraphQL. Using the user id and email from the sessions for now.
        const newVals = { user_id: userId.current, email: email };
        const newProfile = { ...profile, ...newVals };
        setUserProfile(newProfile);
      } else if ((profile === undefined || profile === null) && profileFetching === false) {
        const values = {
          id: 1,
          user_id: userId.current,
          name: name,
          username: '@' + email.split('@')[0],
          email: email,
          image: image,
          title: `${name}'s awesome title`,
          bio: `${name}'s awesome bio`,
          website: 'http://example.com/'
        }
        createProfile({ input: values })
          .then(() => refetch());
      }
    }
  }, [createProfile, email, image, name, profileData?.findProfileUserId, profileFetching, refetch, setUserProfile])

  return (
    <PopoverContent marginRight={'0.3rem'} bg={useColorModeValue('gray.100', 'gray.900')} borderColor={useColorModeValue('orange.200', 'orange.700')}>
      <Fragment>
        <PopoverHeader>
          {session ?
            <Flex justifyContent={'space-between'} alignItems={'center'}>
              {/* {console.log(session)} */}
              <Box justifyContent="flex-start">
                <p><small>Signed in as</small></p>
                <p><strong>{ userProfile.username }</strong></p>
              </Box>
              <Box justifyContent="flex-end">
                {userProfile.image ?
                  <Avatar
                    name={userProfile.name}
                    size={'md'}
                    src={userProfile.image}
                  />
                  :
                  <Icon as={loggedOutIcon} />}
              </Box>
            </Flex>
            :
            <Flex alignItems={'center'} justifyContent={'space-between'} >
              <Box>
                <p><strong>{"You're not signed in"}</strong></p>
              </Box>
              <Box>
                <Icon as={loggedOutIcon} />
              </Box>
            </Flex>
          }
        </PopoverHeader>
        <PopoverBody>
          {session ?
            <Fragment>
              {UserLinks.map((link) => (
                PopoverLink(link)
              ))}
            </Fragment>
            :
            null
          }
          <Button
            size="sm"
            rounded={'md'}
            _hover={{
              textDecoration: 'none',
              bg: useColorModeValue('orange.200', 'orange.700'),
            }}
            onClick={toggleColorMode}
          >
            {colorMode === "light" ? "Dark Mode" : "Light Mode"}
          </Button>
        </PopoverBody>
        <PopoverFooter>
          {session ?
            <Button
              onClick={(e) => {
                e.preventDefault()
                signOut()
              }}
              _hover={{
                textDecoration: 'none',
                bg: useColorModeValue('orange.200', 'orange.700'),
              }}
            >
              Sign Out
            </Button>
            :
            <Link
              px={2}
              py={1}
              rounded={'md'}
              href={`/api/auth/signin`}
            >
              <Button
                _hover={{
                  textDecoration: 'none',
                  bg: useColorModeValue('orange.200', 'orange.700'),
                }}
              >
                Sign In
              </Button>
            </Link>
          }
          <Flex>
            <Link
              px={2}
              py={1}
              rounded={'md'}
              _hover={{
                textDecoration: 'none',
                bg: 'orange', // useColorMode hook inside conditional render throws errors
              }}
              href={`/create-project`}
            >
              New Project
            </Link>
          </Flex>
        </PopoverFooter>
      </Fragment>
    </PopoverContent>
  )
}

export default withUrqlClient(() => ({
  // ...add your Client options here
  url: 'http://localhost:8080/graphql',
}))(NextAuth);
