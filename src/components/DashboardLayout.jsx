
import { Stack, Badge, Box, Flex } from "@chakra-ui/react";
import Topbar from "./Topbar";

const DashboardLayout = ({ children }) => {
  return (
    <Flex direction="column" minH="100vh" bg="gray.50">
       

      
      {/* Topbar */}
      <Topbar />
      {/* Konten halaman */}
      <Box flex="1"  py={1}>
        {children}
      </Box>
    </Flex>
  );
};

export default DashboardLayout;
