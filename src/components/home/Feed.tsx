import {
  Avatar,
  Box,
  Heading,
  VStack,
  Text
} from '@chakra-ui/react';
import React, { useContext } from 'react'
import { UserContext } from '../../context/userContext'
import { useGetFeedQuery } from '../../generated/graphql';

const Feed: React.FC = () => {
  const { userProfile } = useContext(UserContext);
  const { id } = userProfile;

  const [{ fetching, data, error }] = useGetFeedQuery({ variables: { profileId: id } })
  if (fetching) {
    return <div>Loading</div>
  }
  else if (error) {
    return <div>{error.message}</div>
  } else {

    if (data) {
      return (
        <VStack
          alignContent="center"
          w="100vw"
        >
          <Box
            w={["100%", "80%", "80%", "65%"]}
            border="solid 3px"
            borderColor="blue.200"
            my={8}
            h="max-content"
          >
            <Box
              margin="auto"
              textAlign="center"
              mt={2}
            >
              <Heading>Project Update</Heading>
            </Box>
            <Box
              pos="relative"
            >
              <VStack
                alignItems="center"
                w="max-content"
                my={["15px", "-40px", "-40px", "-40px"]}
                pos="absolute"
                top={0}
                left={5}
                bottom={0}
              >
                <Avatar
                  display={{ md: 'none' }}
                  src={userProfile.image}
                  size="md"
                />
                <Avatar
                  display={{ base: 'none', md: "flex" }}
                  src={userProfile.image}
                  size="lg"
                />
                <Heading
                  display={{ base: 'none', md: "flex" }}
                  size="md"
                >
                  {userProfile.name}
                </Heading>
                <Heading
                  display={{ base: 'block', md: "none" }}
                  size="sm"
                >
                  {userProfile.name}
                </Heading>
              </VStack>
            </Box>
            <VStack
              mt={2}
              mb={6}
              ml={["100", "125", "125", "125",]}
              pos="relative"
              alignItems="start"
              mr={2}
            >
              <Text>This is a project update</Text>
              <Text>Plexus Create is coming along nicely</Text>
              <Text>I am showing James how to style things!!</Text>
              <Text>This is a project update</Text>
              <Text>I hope we get this done by tomorrow evening.</Text>
              <Text>TS is a pain in my rump!!</Text>
            </VStack>
          </Box>
        </VStack >
      )
    }
    return (
      <h2> Hold Up </h2>
    )
  }
}
export default Feed;
