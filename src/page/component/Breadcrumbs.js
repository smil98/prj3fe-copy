import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { ChevronRightIcon } from "@chakra-ui/icons";

export const Breadcrumbs = ({ pathSegments, navigate }) => {
  return (
    <Breadcrumb
      separator={<ChevronRightIcon color="gray.500" />}
      fontSize="xs"
      p={0}
      mt={-3}
    >
      <BreadcrumbItem>
        <BreadcrumbLink onClick={() => navigate("/")}>
          <FontAwesomeIcon icon={faHome} fontSize={"0.6rem"} />
        </BreadcrumbLink>
      </BreadcrumbItem>
      {pathSegments.map((segment, index) => (
        <BreadcrumbItem key={index}>
          <BreadcrumbLink
            onClick={() => navigate(`/${pathSegments.slice(0, index + 1)}`)}
          >
            {segment}
          </BreadcrumbLink>
        </BreadcrumbItem>
      ))}
    </Breadcrumb>
  );
};
