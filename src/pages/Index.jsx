import { useState } from "react";
import { Box, Heading, Text, Input, Button, Stack, Grid, useToast, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton, useDisclosure, FormControl, FormLabel } from "@chakra-ui/react";
import { FaSearch, FaCoins } from "react-icons/fa";

const Index = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [requests, setRequests] = useState([
    { id: 1, title: "Need a plumber", description: "My sink is leaking, need it fixed ASAP" },
    { id: 2, title: "Electrician needed", description: "Installing new light fixtures in my home" },
  ]);
  const [credits, setCredits] = useState(0);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleLogin = async () => {
    try {
      const response = await fetch("https://backengine-24ro.fly.dev/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("accessToken", data.accessToken);
        setIsLoggedIn(true);
        toast({ title: "Logged in successfully", status: "success" });
      } else {
        toast({ title: "Invalid credentials", status: "error" });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({ title: "Login failed", status: "error" });
    }
  };

  const handleSignup = async () => {
    try {
      const response = await fetch("https://backengine-24ro.fly.dev/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        toast({ title: "Signup successful, please login", status: "success" });
      } else {
        toast({ title: "Signup failed", status: "error" });
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast({ title: "Signup failed", status: "error" });
    }
  };

  const handleSearch = () => {
    // Perform search based on searchTerm
    console.log("Searching for:", searchTerm);
  };

  const handleRevealContact = (requestId) => {
    if (credits > 0) {
      setCredits(credits - 1);
      toast({
        title: "Contact details revealed",
        description: "You can now view the buyer's phone number and email",
        status: "success",
      });
    } else {
      toast({ title: "Insufficient credits", status: "warning" });
    }
  };

  return (
    <Box p={8}>
      <Heading as="h1" mb={8}>
        Service Marketplace
      </Heading>

      {!isLoggedIn ? (
        <Stack spacing={4} maxW="400px" mx="auto">
          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </FormControl>
          <FormControl>
            <FormLabel>Password</FormLabel>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </FormControl>
          <Button onClick={handleLogin}>Login</Button>
          <Button onClick={handleSignup} variant="outline">
            Signup
          </Button>
        </Stack>
      ) : (
        <>
          <Stack direction="row" mb={8}>
            <Input placeholder="Search for services" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            <Button leftIcon={<FaSearch />} onClick={handleSearch}>
              Search
            </Button>
          </Stack>

          <Stack direction="row" justify="space-between" mb={8}>
            <Text>Credits: {credits}</Text>
            <Button leftIcon={<FaCoins />} onClick={onOpen}>
              Buy Credits
            </Button>
          </Stack>

          <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={8}>
            {requests.map((request) => (
              <Box key={request.id} borderWidth={1} borderRadius="lg" p={4}>
                <Heading as="h3" size="md" mb={2}>
                  {request.title}
                </Heading>
                <Text mb={4}>{request.description}</Text>
                <Button onClick={() => handleRevealContact(request.id)}>Reveal Contact</Button>
              </Box>
            ))}
          </Grid>
        </>
      )}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Buy Credits</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {/* Implement credit purchase form */}
            <Text>Purchase credits to reveal buyer contact details</Text>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Index;
