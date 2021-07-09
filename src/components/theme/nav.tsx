import React, { Fragment, useContext } from 'react';
import {
  Box,
  Flex,
  Avatar,
  HStack,
  Link,
  IconButton,
  Button,
  useDisclosure,
  useColorModeValue,
  Stack,
  Icon,
  Popover,
  PopoverTrigger,
  Spacer,
  SkeletonCircle,
  Heading,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import NextAuth from '../auth/nextAuth';
import { useSession } from 'next-auth/client';
import { UserContext } from '../../context/userContext';
import { FaUserCircle, FaSearch } from "react-icons/fa";
import type { AppProps } from 'next/app'

const Links = ['Home', 'Projects', 'Search'];

const NavLink = (link: string): JSX.Element => (
  <Link
    key={link}
    px={2}
    py={1}
    rounded={'md'}
    _hover={{
      textDecoration: 'none',
      bg: useColorModeValue('orange.200', 'orange.700'),
    }}
    href={link === "Home" ? "/" : `/${link.toLowerCase()}`}
  >
    {link}
  </Link>
);

function Nav(pageProps: AppProps): JSX.Element {
  // Session
  const [session] = useSession();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // User Profile Context
  const { userProfile } = useContext(UserContext)
  // Conditionally render the skeleton loading effects
  const { loadingProfile, setLoadingProfile } = useContext(UserContext)

  return (
    <Fragment>
      <Flex
        w="100vw"
        justifyContent={["center", "center", "start", "center"]}
        ml={["auto", "auto", "20px", "auto"]}
      >
        <Heading // Logo/App Name
          width='max-content'
          zIndex="popover"
          top='0.7rem'
          position='absolute'
          fontSize="3xl"
          _hover={{
            textDecoration: 'none',
            cursor: 'pointer',
            bg: useColorModeValue('orange.200', 'orange.700'),
          }}
        >
          Plexus Create
        </Heading>
      </Flex>

      <Box
        zIndex="sticky"
        as="nav"
        w="100 vw"
        position="sticky"
        top='0'
        alignItems={'center'}
      >

        <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
          <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
            <IconButton
              size={'md'}
              icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
              aria-label={'Open Menu'}
              display={{ md: 'none' }}
              onClick={isOpen ? onClose : onOpen}
            />
            <Spacer />
            <HStack spacing={8} alignItems={'center'}>
              <HStack
                as={'nav'}
                spacing={4}
                display={{ base: 'none', md: 'flex' }}
              >
                {Links.map((link) => {
                  if (link !== 'Search') {
                    return NavLink(link)
                  }
                })}
              </HStack>
            </HStack>
            <Box display={{ base: 'none', md: 'flex' }} marginLeft='0.5rem'>
              <Link
                key="search"
                px={2}
                py={1}
                rounded={'md'}
                _hover={{
                  textDecoration: 'none',
                  bg: useColorModeValue('orange.200', 'orange.700'),
                }}
                href="/search"
              >
                <Icon as={FaSearch} />
              </Link>
            </Box>
            <Box marginLeft='0.5rem' alignItems={'center'}>
              <Popover
                placement="bottom"
                closeOnBlur={false}
              >
                <PopoverTrigger>
                  <Button
                    as={Button}
                    rounded={'full'}
                    variant={'link'}
                    cursor={'pointer'}
                  >
                    {
                      session ?
                        loadingProfile ?
                          <SkeletonCircle size="2rem" />
                          :
                          userProfile.image ?
                            <Avatar
                              name={userProfile.name}
                              size={'sm'}
                              src={userProfile.image}
                            />
                            :
                            <Icon boxSize={8} as={FaUserCircle} />
                        :
                        <Icon boxSize={8} as={FaUserCircle} />
                    }
                  </Button>
                </PopoverTrigger>
                <NextAuth {...pageProps} />
              </Popover>
            </Box>
          </Flex>

          {isOpen ? (
            <Box pb={4} display={{ md: 'none' }}>
              <Stack as={'nav'} spacing={4}>
                {Links.map((link) => (
                  NavLink(link)
                ))}
              </Stack>
            </Box>
          ) : null}
        </Box>
      </Box>
    </Fragment>
  );
}

export default Nav;